export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

const NAV_INDEX = new Map(NAV_ITEMS.map((item, index) => [item.href, index]));

function normalizePath(path: string): string {
  return path.split("?")[0].split("#")[0];
}

export function getNavIndex(pathname: string): number | null {
  return NAV_INDEX.get(normalizePath(pathname)) ?? null;
}

/** Resolve which nav tab is active, including nested routes (e.g. /projects/[slug]). */
export function getActiveNavId(pathname: string): string {
  const path = normalizePath(pathname);

  if (path === "/projects" || path.startsWith("/projects/")) {
    return "projects";
  }

  return NAV_ITEMS.find((i) => i.href === path)?.id ?? NAV_ITEMS[0]?.id ?? "home";
}

export function isSearchRoute(pathname: string): boolean {
  return normalizePath(pathname) === "/search";
}

export function getTransitionTypes(fromPath: string, toHref: string): string[] {
  const from = normalizePath(fromPath);
  const to = normalizePath(toHref);

  if (from === to) return [];

  return ["nav-slide"];
}
