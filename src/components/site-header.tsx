"use client";

import { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { NAV_ITEMS, type NavItem } from "@/lib/nav-order";
import { useNavigateWithScroll } from "@/hooks/use-navigate-with-scroll";

// ─── Site config ─────────────────────────────────────────────────────────────

interface SitePage {
  id: string; title: string; desc: string;
  navId: string; category: string; color: string;
}

const SITE_PAGES: SitePage[] = [
  { id: "home",     navId: "home",     title: "Home",     desc: "Welcome",        category: "Page", color: "#a5b4fc" },
  { id: "projects", navId: "projects", title: "Projects", desc: "Browse my work", category: "Page", color: "#86efac" },
  { id: "about",    navId: "about",    title: "About",    desc: "A bit about me", category: "Page", color: "#fde68a" },
  { id: "contact",  navId: "contact",  title: "Contact",  desc: "Get in touch",   category: "Page", color: "#f9a8d4" },
];

const SUGGESTION_COUNT = 3;

// ─── Shared ───────────────────────────────────────────────────────────────────

const SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };

const GLASS: React.CSSProperties = {
  background:           "hsla(0, 0%, 50%, 0.22)",
  backdropFilter:       "blur(25px)",
  WebkitBackdropFilter: "blur(25px)",
  boxShadow:            "var(--glass-ring)",
};

// iOS Safari touch fix — only on mobile; transform on desktop breaks layoutId pill animation.
const MOBILE_GLASS: React.CSSProperties = {
  ...GLASS,
  transform:                "translateZ(0)",
  WebkitBackfaceVisibility: "hidden",
};

const ICON_PROPS = {
  width: 16, height: 16, viewBox: "0 0 16 16", fill: "none",
  stroke: "currentColor", strokeWidth: "1.75",
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

const NAV_FONT: React.CSSProperties = {
  fontFamily: "var(--font-strawford), system-ui, sans-serif",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchSvg() {
  return <svg {...ICON_PROPS}><circle cx="7" cy="7" r="4.5" /><line x1="10.5" y1="10.5" x2="14" y2="14" /></svg>;
}
function CloseSvg() {
  return <svg {...ICON_PROPS}><line x1="3.5" y1="3.5" x2="12.5" y2="12.5" /><line x1="12.5" y1="3.5" x2="3.5" y2="12.5" /></svg>;
}
function HamburgerSvg() {
  return <svg {...ICON_PROPS}><line x1="2.5" y1="5" x2="13.5" y2="5" /><line x1="2.5" y1="8" x2="13.5" y2="8" /><line x1="2.5" y1="11" x2="13.5" y2="11" /></svg>;
}
function SunSvg() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1.5" x2="8" y2="3" /><line x1="8" y1="13" x2="8" y2="14.5" />
      <line x1="1.5" y1="8" x2="3" y2="8" /><line x1="13" y1="8" x2="14.5" y2="8" />
      <line x1="3.4" y1="3.4" x2="4.4" y2="4.4" /><line x1="11.6" y1="11.6" x2="12.6" y2="12.6" />
      <line x1="12.6" y1="3.4" x2="11.6" y2="4.4" /><line x1="4.4" y1="11.6" x2="3.4" y2="12.6" />
    </svg>
  );
}
function MoonSvg() {
  return <svg {...ICON_PROPS}><path d="M13 9.5A5.5 5.5 0 1 1 6.5 3c-.5 2 .5 5 3 6.5 1.5.8 3 .8 3.5 0z" /></svg>;
}

function ThemeToggleIcon() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span className="flex size-4" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <AnimatePresence initial={false} mode="wait">
      {isDark ? (
        <motion.span
          key="sun"
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex"
        >
          <SunSvg />
        </motion.span>
      ) : (
        <motion.span
          key="moon"
          initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex"
        >
          <MoonSvg />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function ThemeToggleButton({ className }: { className: string }) {
  const { setTheme } = useTheme();

  return (
    <button
      className={className}
      onClick={() =>
        setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
      }
      aria-label="Toggle theme"
    >
      <ThemeToggleIcon />
    </button>
  );
}

/** Sliding white pill — positioned from measured nav slot bounds. */
function SlidingPill({
  left,
  width,
  visible,
}: {
  left: number;
  width: number;
  visible: boolean;
}) {
  return (
    <motion.div
      className="absolute top-2 bottom-2 left-0 bg-white rounded-full pointer-events-none"
      initial={false}
      animate={{ x: left, width, opacity: visible ? 1 : 0 }}
      transition={SPRING}
      style={{ zIndex: 0 }}
    />
  );
}

function pathOnly(href: string): string {
  return href.split("?")[0].split("#")[0];
}

// ─── Search Results ───────────────────────────────────────────────────────────

function SearchResults({ query, onSelect, minTouch }: { query: string; onSelect?: (navId: string) => void; minTouch?: boolean }) {
  const q = query.trim().toLowerCase();
  const results = q
    ? SITE_PAGES.filter(r =>
        r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    : SITE_PAGES.slice(0, SUGGESTION_COUNT);

  return (
    <div className="p-3">
      <p
        className="px-1 pb-3 text-[11px] uppercase tracking-widest text-black/40 dark:text-white/40"
        style={NAV_FONT}
      >
        {q ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "Suggestions"}
      </p>
      <motion.div layout transition={SPRING} className="flex flex-col gap-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((result, i) => (
            <motion.button key={result.id} layout
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ ...SPRING, delay: i * 0.03 }}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-left hover:bg-black/8 dark:hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:hover:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset] active:bg-white/60 dark:active:bg-white/20 transition-colors${minTouch ? " min-h-[40px]" : ""}`}
              onClick={() => onSelect?.(result.navId)}>
              <span className="shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: result.color }} />
              <span className="flex-1 min-w-0">
                <span
                  className="block text-[15px] text-black dark:text-white leading-snug truncate"
                  style={NAV_FONT}
                >
                  {result.title}
                </span>
                <span
                  className="block text-[12px] text-black/50 dark:text-white/50 truncate mt-0.5"
                  style={NAV_FONT}
                >
                  {result.desc}
                </span>
              </span>
              <span
                className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/15 text-black/60 dark:text-white/70 font-medium whitespace-nowrap"
                style={NAV_FONT}
              >
                {result.category}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {results.length === 0 && (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="py-5 text-center text-[15px] text-black/40 dark:text-white/40"
              style={NAV_FONT}>
              No results for &ldquo;{query}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Desktop Header ───────────────────────────────────────────────────────────
//
// All six slots (Home, Projects, About, Contact, Theme, Search) are direct
// children of the same flex row — no inner overflow container. This means the
// shared-layoutId pill can spring freely between ANY two slots without crossing
// an overflow or AnimatePresence boundary.

function DesktopHeader() {
  const navigate = useNavigateWithScroll();
  const pathname = usePathname();

  const active = NAV_ITEMS.find(i => i.href === pathname)?.id ?? NAV_ITEMS[0]?.id ?? "";

  const [hovered,     setHovered]     = useState<string | null>(null);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [pillTarget,  setPillTarget]  = useState<string | null>(null);

  const barRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  useEffect(() => setPillTarget(null), [pathname]);

  const pillAt = useMemo(() => {
    if (searchOpen) return "__searchbar__";
    return pillTarget ?? active;
  }, [searchOpen, active, pillTarget]);

  useLayoutEffect(() => {
    const update = () => {
      const bar = barRef.current;
      const slot = slotRefs.current[pillAt];
      if (!bar || !slot) {
        setPill((p) => ({ ...p, visible: false }));
        return;
      }

      const barRect = bar.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      setPill({
        left: slotRect.left - barRect.left,
        width: slotRect.width,
        visible: true,
      });
    };

    update();
    const bar = barRef.current;
    if (!bar) return;

    const ro = new ResizeObserver(update);
    ro.observe(bar);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [pillAt, searchOpen, pathname]);

  const handleSelect = (item: NavItem) => {
    if (pathOnly(item.href) !== pathOnly(pathname)) {
      setPillTarget(item.id);
    }
    navigate(item.href);
  };

  const openSearch = () => {
    setSearchOpen(true);
    setShowResults(true);
    setSearchQuery("");
  };
  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); setShowResults(false); };

  const navText = (id: string) =>
    pillAt === id ? "text-black" : "text-black dark:text-white";
  const ICON_BTN = "absolute inset-0 flex items-center justify-center rounded-full z-10";

  return (
    <LayoutGroup id="desktop-header">
      <div className="flex flex-col gap-2">

        {/* ── Bar ─────────────────────────────────────────────────────────────
            All slots are direct flex children — pill travels freely between
            all of them with no overflow boundary to cross.
        ──────────────────────────────────────────────────────────────────── */}
        <div
          ref={barRef}
          className="relative flex items-center gap-1 p-2 rounded-full"
          style={GLASS}
        >
          <SlidingPill left={pill.left} width={pill.width} visible={pill.visible} />

          {/* ── Left nav slots (Home, Projects, About) — collapse when search opens ── */}
          <motion.div
            className="flex items-center gap-1 shrink-0"
            style={{ pointerEvents: searchOpen ? "none" : undefined }}
            animate={{ maxWidth: searchOpen ? 0 : 2000, opacity: searchOpen ? 0 : 1 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {NAV_ITEMS.slice(0, -1).map(item => (
              <div
                key={item.id}
                ref={(el) => { slotRefs.current[item.id] = el; }}
                className="relative shrink-0"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Fade highlight — only on non-active items */}
                <AnimatePresence>
                  {hovered === item.id && pillAt !== item.id && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-black/8 dark:bg-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </AnimatePresence>
                <button
                  className={`relative z-10 h-[35px] px-4 flex items-center rounded-full text-[16px] whitespace-nowrap ${navText(item.id)}`}
                  style={NAV_FONT}
                  onClick={() => handleSelect(item)}
                  tabIndex={searchOpen ? -1 : 0}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </motion.div>

          {/* ── Flex spacer ── */}
          <div className="flex-1 min-w-0" />

          {/* ── Right nav slot (Contact) — sits next to theme toggle, collapses in search ── */}
          {NAV_ITEMS.slice(-1).map(item => (
            <motion.div
              key={item.id}
              ref={(el) => { slotRefs.current[item.id] = el; }}
              className="relative shrink-0"
              style={{ pointerEvents: searchOpen ? "none" : undefined }}
              animate={{ maxWidth: searchOpen ? 0 : 200, opacity: searchOpen ? 0 : 1 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <AnimatePresence>
                {hovered === item.id && pillAt !== item.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-black/8 dark:bg-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }} style={{ zIndex: 0 }}
                  />
                )}
              </AnimatePresence>
              <button
                className={`relative z-10 h-[35px] px-4 flex items-center rounded-full text-[16px] whitespace-nowrap ${navText(item.id)}`}
                style={NAV_FONT}
                onClick={() => handleSelect(item)}
                tabIndex={searchOpen ? -1 : 0}
              >
                {item.label}
              </button>
            </motion.div>
          ))}

          {/* ── Full-width search input overlay — absolutely fills bar when open ── */}
          {/* Full-bar overlay — extends under the X button (which floats above at z-20) */}
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.div
                key="search-overlay"
                ref={(el) => { slotRefs.current.__searchbar__ = el; }}
                className="absolute inset-2 right-2 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="absolute inset-0 z-10 flex items-center gap-2 pl-3 pr-[43px]">
                  <span className="shrink-0 text-black/50"><SearchSvg /></span>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder:text-black/40"
                    style={NAV_FONT}
                    onKeyDown={e => {
                      if (e.key === "Escape") closeSearch();
                      if (e.key === "Enter" && searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        closeSearch();
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Theme toggle slot — hidden in search mode ── */}
          <AnimatePresence initial={false}>
            {!searchOpen && (
              <motion.div
                key="theme-toggle"
                className="relative shrink-0 w-[35px] h-[35px]"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.15 }}
                onMouseEnter={() => setHovered("__theme__")}
                onMouseLeave={() => setHovered(null)}
              >
                <AnimatePresence>
                  {hovered === "__theme__" && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-black/8 dark:bg-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </AnimatePresence>
                <ThemeToggleButton className={`${ICON_BTN} text-black dark:text-white`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Search / close slot — z-20 floats above the search overlay ── */}
          <div
            className="relative shrink-0 w-[35px] h-[35px] z-20"
            onMouseEnter={() => setHovered("__search__")}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Resting bg in search mode; hover bg otherwise */}
            <AnimatePresence>
              {(searchOpen || hovered === "__search__") && (
                <motion.div
                  className={`absolute inset-0 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset] ${searchOpen && hovered === "__search__" ? "bg-black/15" : searchOpen ? "bg-black/8" : "bg-black/8 dark:bg-white/10"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ zIndex: 0 }}
                />
              )}
            </AnimatePresence>
            <AnimatePresence initial={false} mode="wait">
              {searchOpen ? (
                <motion.button key="x"
                  className={`${ICON_BTN} text-black`}
                  initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={closeSearch} aria-label="Close search">
                  <CloseSvg />
                </motion.button>
              ) : (
                <motion.button key="search"
                  className={`${ICON_BTN} text-black dark:text-white`}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={openSearch} aria-label="Open search">
                  <SearchSvg />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Search results dropdown ── */}
        <AnimatePresence initial={false}>
          {showResults && (
            <motion.div key="results"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={SPRING} className="rounded-[28px] overflow-hidden" style={GLASS}>
              <SearchResults
                query={searchQuery}
                onSelect={navId => {
                  const item = NAV_ITEMS.find(i => i.id === navId);
                  if (item) handleSelect(item);
                  closeSearch();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

// ─── Mobile Header ────────────────────────────────────────────────────────────

function MobileHeader() {
  const navigate = useNavigateWithScroll();
  const pathname = usePathname();

  const active = NAV_ITEMS.find(i => i.href === pathname)?.id ?? NAV_ITEMS[0]?.id ?? "";

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };
  const openSearch  = () => { setMenuOpen(false); setSearchOpen(true); };
  const toggleMenu  = () => { setMenuOpen(v => !v); closeSearch(); };

  const handleSelect = (item: NavItem) => { navigate(item.href); setMenuOpen(false); };

  const ICON_BTN = "absolute inset-0 flex items-center justify-center rounded-full z-10";
  const TOUCH = "min-h-[40px] min-w-[40px]";

  return (
    <LayoutGroup id="mobile-header">
      <div className="flex flex-col gap-2">
        <div className="w-full rounded-[28px] overflow-hidden" style={MOBILE_GLASS}>

          {/* Top bar */}
          <div className="relative flex items-center gap-2 p-2 min-h-[56px]">

            {/* Hamburger — collapses when search opens */}
            <motion.div
              className="shrink-0"
              style={{ pointerEvents: searchOpen ? "none" : undefined }}
              animate={{ maxWidth: searchOpen ? 0 : 48, opacity: searchOpen ? 0 : 1 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <button onClick={toggleMenu}
                className={`flex items-center justify-center w-[40px] h-[40px] ${TOUCH} rounded-full text-black dark:text-white hover:bg-black/8 dark:hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:hover:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset] transition-colors`}
                aria-label={menuOpen ? "Close menu" : "Open menu"}>
                <AnimatePresence initial={false} mode="wait">
                  {menuOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0.5 }} transition={{ duration: 0.18 }} className="flex"><CloseSvg /></motion.span>
                  ) : (
                    <motion.span key="b" initial={{ rotate: 90, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0.5 }} transition={{ duration: 0.18 }} className="flex"><HamburgerSvg /></motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            {/* Spacer */}
            <div className="flex-1 min-w-0" />

            {/* Full-bar search overlay — extends under the X button */}
            <AnimatePresence initial={false}>
              {searchOpen && (
                <motion.div
                  key="mobile-search-overlay"
                  className="absolute inset-2 right-2 z-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="absolute inset-0 bg-white rounded-full" />
                  <div className="absolute inset-0 z-10 flex items-center gap-2 pl-3 pr-[48px]">
                    <span className="shrink-0 text-black/50"><SearchSvg /></span>
                    <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder:text-black/40 min-w-0"
                      style={NAV_FONT}
                      onKeyDown={e => {
                        if (e.key === "Escape") closeSearch();
                        if (e.key === "Enter") {
                          e.currentTarget.blur();
                          if (searchQuery.trim()) {
                            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                            closeSearch();
                          }
                        }
                      }}
                      enterKeyHint="search"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Theme toggle — collapses when search opens */}
            <AnimatePresence initial={false}>
              {!searchOpen && (
                <motion.div
                  key="mobile-theme"
                  className={`relative shrink-0 w-[40px] h-[40px] ${TOUCH} rounded-full hover:bg-black/8 dark:hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:hover:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset] transition-colors`}
                  initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }}
                >
                  <ThemeToggleButton className={`${ICON_BTN} text-black dark:text-white`} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search / close — z-20 floats above search overlay */}
            <div className={`relative shrink-0 w-[40px] h-[40px] ${TOUCH} z-20 rounded-full transition-colors shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset] ${searchOpen ? "bg-black/8 hover:bg-black/15" : "hover:bg-black/8 dark:hover:bg-white/10 shadow-transparent hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:hover:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"}`}>
              <AnimatePresence initial={false} mode="wait">
                {searchOpen ? (
                  <motion.button key="x" className={`${ICON_BTN} text-black`}
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={closeSearch} aria-label="Close search"><CloseSvg /></motion.button>
                ) : (
                  <motion.button key="search" className={`${ICON_BTN} text-black dark:text-white`}
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={openSearch} aria-label="Search"><SearchSvg /></motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Expandable nav menu */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div key="menu" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                transition={SPRING} className="overflow-hidden">
                <div className="flex flex-col gap-1 px-2 pb-2">
                  {NAV_ITEMS.map((item, i) => (
                    <motion.div key={item.id} className="relative"
                      initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
                      transition={{ ...SPRING, delay: i * 0.04 }}>
                      {active === item.id && (
                        <motion.div layoutId="mobile-pill" className="absolute inset-0 bg-white rounded-full" transition={SPRING} />
                      )}
                      <button onClick={() => handleSelect(item)}
                        className={`relative z-10 w-full h-[40px] ${TOUCH} px-4 flex items-center text-[16px] text-left rounded-full transition-colors ${active === item.id ? "text-black" : "text-black dark:text-white hover:bg-black/8 dark:hover:bg-white/10 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08)_inset] dark:hover:shadow-[0_0_0_1px_hsla(0,0%,100%,0.12)_inset]"}`}
                        style={NAV_FONT}>
                        {item.label}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile search results */}
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div key="mobile-results"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={SPRING} className="rounded-[28px] overflow-hidden" style={MOBILE_GLASS}>
              <SearchResults
                minTouch
                query={searchQuery}
                onSelect={navId => {
                  const item = NAV_ITEMS.find(i => i.id === navId);
                  if (item) handleSelect(item);
                  closeSearch();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function SiteHeader() {
  return (
    <>
      <div className="hidden sm:block"><DesktopHeader /></div>
      <div className="sm:hidden"><MobileHeader /></div>
    </>
  );
}
