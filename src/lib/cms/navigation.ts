import { NAV_ITEMS, type NavItem } from "@/lib/nav-order";
import { getCmsNavPages, getSiteSettings } from "./pages";

export function buildNavItems(): NavItem[] {
  const cmsItems: NavItem[] = getCmsNavPages().map((page) => ({
    id: `cms-${page.slug}`,
    label: page.navLabel?.trim() || page.title,
    href: `/pages/${page.slug}`,
  }));

  const extraItems: NavItem[] =
    getSiteSettings().extraNav?.map((link, index) => ({
      id: `extra-nav-${index}`,
      label: link.label,
      href: link.href,
    })) ?? [];

  const [home, projects, about, contact] = NAV_ITEMS;
  return [home, projects, about, ...cmsItems, ...extraItems, contact].filter(
    (item): item is NavItem => Boolean(item),
  );
}
