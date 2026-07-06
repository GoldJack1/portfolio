import type { CmsBlock } from "./types";

export function blocksSearchText(blocks: CmsBlock[]): string {
  const parts: string[] = [];

  const push = (...values: (string | undefined)[]) => {
    for (const value of values) {
      if (value) parts.push(value);
    }
  };

  for (const block of blocks) {
    switch (block.type) {
      case "hero":
        push(block.eyebrow, block.heading, block.body);
        break;
      case "heading":
        push(block.text);
        break;
      case "text":
        push(block.body);
        break;
      case "cta":
        push(block.heading, block.body);
        break;
      case "timeline":
        push(block.heading);
        for (const item of block.items) {
          push(item.period, item.title, item.subtitle, item.description);
        }
        break;
      case "tagGroups":
        push(block.heading);
        for (const group of block.groups) {
          push(group.category, ...group.items);
        }
        break;
      case "bulletList":
        push(block.heading, ...block.items);
        break;
      case "projectGrid":
        push(block.heading, block.intro);
        break;
      case "featuredProjects":
        push(block.heading, block.linkLabel);
        break;
      case "linkList":
        push(block.heading);
        for (const link of block.links) {
          push(link.label, link.display, link.href);
        }
        break;
      default:
        break;
    }
  }

  return parts.filter(Boolean).join(" ");
}
