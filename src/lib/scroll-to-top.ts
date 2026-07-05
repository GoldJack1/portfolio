const SCROLL_THRESHOLD = 4;
const SCROLL_MAX_WAIT = 800;
const SETTLE_DELAY = 40;

function isMobileViewport(): boolean {
  return window.matchMedia("(max-width: 768px)").matches;
}

export function scrollToTopThen(callback: () => void): void {
  if (typeof window === "undefined") {
    callback();
    return;
  }

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = isMobileViewport();

  if (window.scrollY <= SCROLL_THRESHOLD) {
    callback();
    return;
  }

  let done = false;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const onScroll = () => finish();

  const cleanup = () => {
    window.removeEventListener("scroll", onScroll);
    if (timeout !== undefined) clearTimeout(timeout);
    if (settleTimer !== undefined) clearTimeout(settleTimer);
  };

  const finish = () => {
    if (done) return;
    if (window.scrollY > SCROLL_THRESHOLD) return;

    done = true;
    cleanup();

    if (mobile || prefersReduced) {
      callback();
      return;
    }

    settleTimer = setTimeout(callback, SETTLE_DELAY);
  };

  if (prefersReduced || mobile) {
    window.scrollTo(0, 0);
    finish();
    return;
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  window.addEventListener("scroll", onScroll, { passive: true });

  timeout = setTimeout(() => {
    window.scrollTo(0, 0);
    finish();
  }, SCROLL_MAX_WAIT);
}
