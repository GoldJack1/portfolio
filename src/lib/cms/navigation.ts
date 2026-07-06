import cmsNavPagesData from "@/data/cms-nav-pages.json";
import { getSiteSettingsData } from "@/lib/site-settings";
import type { NavItem } from "@/lib/nav-order";

type CmsNavPage = {
  slug: string;
  title: string;
  navLabel?: string;
  showInNav?: boolean;
};

const DEFAULT_NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

function getCmsNavItems(): NavItem[] {
  return (cmsNavPagesData as CmsNavPage[])
    .filter((page) => page.showInNav)
    .map((page) => ({
      id: `cms-${page.slug}`,
      label: page.navLabel?.trim() || page.title,
      href: `/pages/${page.slug}`,
    }));
}

export function buildNavItems(): NavItem[] {
  const settings = getSiteSettingsData();
  const cmsPages = getCmsNavItems();

  const extraItems: NavItem[] =
    settings.extraNav?.map((link, index) => ({
      id: `extra-nav-${index}`,
      label: link.label,
      href: link.href,
    })) ?? [];

  const configured = (settings.navItems?.length ? settings.navItems : DEFAULT_NAV.map((item) => ({ ...item, visible: true })))
    .filter((item) => item.visible !== false)
    .map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
    }));

  const contactIndex = configured.findIndex((item) => item.id === "contact");
  if (contactIndex >= 0) {
    return [
      ...configured.slice(0, contactIndex),
      ...cmsPages,
      ...extraItems,
      ...configured.slice(contactIndex),
    ];
  }

  return [...configured, ...cmsPages, ...extraItems];
}
