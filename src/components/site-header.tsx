"use client";

import { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { getActiveNavId, type NavItem, NAV_ITEMS } from "@/lib/nav-order";
import { useNavigateWithScroll } from "@/hooks/use-navigate-with-scroll";
import { useHeaderContrastClasses } from "@/hooks/use-header-contrast-classes";
import { headerSearchResults, type SearchResult } from "@/lib/site-search";
import { iconWeightFromClass } from "@/lib/icons/icon-weight-from-class";
import { sansBold, sansLight, sansMedium } from "@/lib/typography";
import Icon, { AnimatedMenuIcon } from "@/components/ui/icon";

// ─── Shared ───────────────────────────────────────────────────────────────────

const SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };
const HEADER_ICON_WEIGHT = iconWeightFromClass(sansBold);
/** Match bold 16px nav label — full em box, not cap height */
const HEADER_ICON_SIZE = "1em" as const;

function HeaderSearchIcon() {
  return (
    <Icon
      name="search"
      font="sans"
      weight={HEADER_ICON_WEIGHT}
      size={HEADER_ICON_SIZE}
      aria-hidden
    />
  );
}

function HeaderCloseIcon() {
  return (
    <Icon
      name="cross"
      font="sans"
      weight={HEADER_ICON_WEIGHT}
      size={HEADER_ICON_SIZE}
      aria-hidden
    />
  );
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
          className="flex text-[16px] leading-none"
        >
          <Icon name="sun" font="sans" weight={HEADER_ICON_WEIGHT} size={HEADER_ICON_SIZE} aria-hidden />
        </motion.span>
      ) : (
        <motion.span
          key="moon"
          initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex text-[16px] leading-none"
        >
          <Icon name="moon" font="sans" weight={HEADER_ICON_WEIGHT} size={HEADER_ICON_SIZE} aria-hidden />
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

function SearchResults({
  query,
  onSelect,
  onViewMore,
  minTouch,
}: {
  query: string;
  onSelect?: (result: SearchResult) => void;
  onViewMore?: () => void;
  minTouch?: boolean;
}) {
  const hc = useHeaderContrastClasses();
  const q = query.trim();
  const { results, total } = headerSearchResults(query);
  const hasMore = q.length > 0 && total > results.length;

  return (
    <div className="p-3">
      <p
        className={`px-1 pb-3 text-[11px] uppercase tracking-widest ${hc.searchMuted} ${sansLight}`}
      >
        {q ? `${total} result${total !== 1 ? "s" : ""}` : "Suggestions"}
      </p>
      <motion.div layout transition={SPRING} className="flex flex-col gap-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((result, i) => (
            <motion.button key={result.id} layout
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ ...SPRING, delay: i * 0.03 }}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-left ${hc.searchHoverRow} transition-colors${minTouch ? " min-h-[40px]" : ""}`}
              onClick={() => onSelect?.(result)}>
              <span className="flex-1 min-w-0">
                <span
                  className={`block text-[15px] ${hc.searchResultTitle} leading-snug truncate ${sansMedium}`}
                >
                  {result.title}
                </span>
                <span
                  className={`block text-[12px] ${hc.searchResultDesc} truncate mt-0.5 ${sansLight}`}
                >
                  {result.desc}
                </span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
        {hasMore && (
          <button
            type="button"
            onClick={onViewMore}
            className={`mt-1 w-full px-3 py-3 rounded-2xl text-left text-[14px] ${hc.searchMutedMid} ${hc.searchHoverRow} transition-colors${minTouch ? " min-h-[40px]" : ""} ${sansMedium}`}
          >
            View more results ({total})
          </button>
        )}
        <AnimatePresence initial={false}>
          {results.length === 0 && (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`py-5 text-center text-[15px] ${hc.searchMuted} ${sansMedium}`}>
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

function DesktopHeader({ navItems }: { navItems: NavItem[] }) {
  const navigate = useNavigateWithScroll();
  const pathname = usePathname();
  const hc = useHeaderContrastClasses();

  const active = getActiveNavId(pathname);

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

  const navText = (id: string) => hc.navText(pillAt === id);
  const ICON_BTN = "absolute inset-0 flex items-center justify-center rounded-full z-10 text-[16px] leading-none";

  return (
    <LayoutGroup id="desktop-header">
      <div className="flex flex-col gap-2">

        {/* ── Bar ─────────────────────────────────────────────────────────────
            All slots are direct flex children — pill travels freely between
            all of them with no overflow boundary to cross.
        ──────────────────────────────────────────────────────────────────── */}
        <div
          ref={barRef}
          data-header-top-bar
          className={`relative flex items-center gap-1 p-2 rounded-full ${hc.glass}`}
          style={hc.glassStyle}
        >
          <SlidingPill left={pill.left} width={pill.width} visible={pill.visible} />

          {/* ── Left nav slots (Home, Projects, About) — collapse when search opens ── */}
          <motion.div
            className="flex items-center gap-1 shrink-0"
            style={{ pointerEvents: searchOpen ? "none" : undefined }}
            animate={{ maxWidth: searchOpen ? 0 : 2000, opacity: searchOpen ? 0 : 1 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {navItems.slice(0, -1).map(item => (
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
                      className={`absolute inset-0 rounded-full ${hc.hoverBg}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </AnimatePresence>
                <button
                  className={`relative z-10 h-[35px] px-4 flex items-center rounded-full text-[16px] leading-none whitespace-nowrap ${navText(item.id)} ${sansBold}`}
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
          {navItems.slice(-1).map(item => (
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
                    className={`absolute inset-0 rounded-full ${hc.hoverBg}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }} style={{ zIndex: 0 }}
                  />
                )}
              </AnimatePresence>
              <button
                className={`relative z-10 h-[35px] px-4 flex items-center rounded-full text-[16px] leading-none whitespace-nowrap ${navText(item.id)} ${sansBold}`}
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
                  <span className={`shrink-0 text-[16px] leading-none ${hc.searchIcon}`}><HeaderSearchIcon /></span>
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search"
                    className={`flex-1 bg-transparent outline-none text-[16px] leading-none ${hc.input} ${sansBold}`}
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
                      className={`absolute inset-0 rounded-full ${hc.hoverBg}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                </AnimatePresence>
                <ThemeToggleButton className={`${ICON_BTN} ${hc.icon}`} />
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
                  className={`absolute inset-0 rounded-full ${
                    searchOpen
                      ? `${hc.searchCloseRing} ${hovered === "__search__" ? hc.searchCloseHover : hc.searchCloseRest}`
                      : `${hc.ring} ${hovered === "__search__" ? hc.hoverBgStrong : hc.onDark ? "bg-white/10" : "bg-black/8"}`
                  }`}
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
                  className={`${ICON_BTN} ${hc.searchCloseIcon}`}
                  initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={closeSearch} aria-label="Close search">
                  <HeaderCloseIcon />
                </motion.button>
              ) : (
                <motion.button key="search"
                  className={`${ICON_BTN} ${hc.icon}`}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={openSearch} aria-label="Open search">
                  <HeaderSearchIcon />
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
              transition={SPRING} className="rounded-[28px] overflow-hidden" style={hc.searchPanelStyle}>
              <SearchResults
                query={searchQuery}
                onSelect={(result) => {
                  navigate(result.href);
                  closeSearch();
                }}
                onViewMore={() => {
                  const q = searchQuery.trim();
                  navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
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

function MobileHeader({ navItems }: { navItems: NavItem[] }) {
  const navigate = useNavigateWithScroll();
  const pathname = usePathname();
  const hc = useHeaderContrastClasses();

  const active = getActiveNavId(pathname);

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };
  const openSearch  = () => { setMenuOpen(false); setSearchOpen(true); };
  const toggleMenu  = () => { setMenuOpen(v => !v); closeSearch(); };

  const handleSelect = (item: NavItem) => { navigate(item.href); setMenuOpen(false); };

  const ICON_BTN = "absolute inset-0 flex items-center justify-center rounded-full z-10 text-[16px] leading-none";
  const TOUCH = "min-h-[40px] min-w-[40px]";

  return (
    <LayoutGroup id="mobile-header">
      <div className="flex flex-col gap-2">
        <div className={`w-full rounded-[28px] overflow-hidden ${hc.mobileGlass}`} style={hc.mobileGlassStyle}>

          {/* Top bar */}
          <div data-header-top-bar className="relative flex items-center gap-2 p-2 min-h-[56px]">

            {/* Hamburger — collapses when search opens */}
            <motion.div
              className="shrink-0"
              style={{ pointerEvents: searchOpen ? "none" : undefined }}
              animate={{ maxWidth: searchOpen ? 0 : 48, opacity: searchOpen ? 0 : 1 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <button onClick={toggleMenu}
                className={`flex items-center justify-center w-[40px] h-[40px] ${TOUCH} rounded-full text-[16px] leading-none ${hc.icon} ${hc.searchBtnRest} transition-colors`}
                aria-label={menuOpen ? "Close menu" : "Open menu"}>
                <AnimatedMenuIcon
                  isOpen={menuOpen}
                  font="sans"
                  weight={HEADER_ICON_WEIGHT}
                  size={HEADER_ICON_SIZE}
                />
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
                    <span className={`shrink-0 text-[16px] leading-none ${hc.searchIcon}`}><HeaderSearchIcon /></span>
                    <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      className={`flex-1 bg-transparent outline-none text-[16px] leading-none min-w-0 ${hc.input} ${sansBold}`}
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
                  className={`relative shrink-0 w-[40px] h-[40px] ${TOUCH} rounded-full ${hc.searchBtnRest} transition-colors`}
                  initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.15 }}
                >
                  <ThemeToggleButton className={`${ICON_BTN} ${hc.icon}`} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search / close — z-20 floats above search overlay */}
            <div className={`relative shrink-0 w-[40px] h-[40px] ${TOUCH} z-20 rounded-full transition-colors ${
              searchOpen
                ? `${hc.searchCloseRing} ${hc.searchCloseRest}`
                : `shadow-transparent ${hc.searchBtnRest}`
            }`}>
              <AnimatePresence initial={false} mode="wait">
                {searchOpen ? (
                  <motion.button key="x" className={`${ICON_BTN} ${hc.searchCloseIcon}`}
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={closeSearch} aria-label="Close search"><HeaderCloseIcon /></motion.button>
                ) : (
                  <motion.button key="search" className={`${ICON_BTN} ${hc.icon}`}
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={openSearch} aria-label="Search"><HeaderSearchIcon /></motion.button>
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
                  {navItems.map((item, i) => (
                    <motion.div key={item.id} className="relative"
                      initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
                      transition={{ ...SPRING, delay: i * 0.04 }}>
                      {active === item.id && (
                        <motion.div layoutId="mobile-pill" className="absolute inset-0 bg-white rounded-full" transition={SPRING} />
                      )}
                      <button onClick={() => handleSelect(item)}
                        className={`relative z-10 w-full h-[40px] ${TOUCH} px-4 flex items-center text-[16px] text-left rounded-full transition-colors ${active === item.id ? "text-black" : `${hc.navText(false)} ${hc.searchBtnRest}`} ${sansBold}`}>
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
              transition={SPRING} className="rounded-[28px] overflow-hidden" style={hc.searchPanelStyle}>
              <SearchResults
                minTouch
                query={searchQuery}
                onSelect={(result) => {
                  navigate(result.href);
                  closeSearch();
                }}
                onViewMore={() => {
                  const q = searchQuery.trim();
                  navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
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

export default function SiteHeader({ navItems = NAV_ITEMS }: { navItems?: NavItem[] }) {
  return (
    <>
      <div className="hidden sm:block"><DesktopHeader navItems={navItems} /></div>
      <div className="sm:hidden"><MobileHeader navItems={navItems} /></div>
    </>
  );
}
