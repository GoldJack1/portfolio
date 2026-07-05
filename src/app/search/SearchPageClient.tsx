"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import TransitionLink from "@/components/transition-link";
import VideoThumbnail from "@/components/video-thumbnail";
import { PROJECTS, isVideoThumbnail } from "@/lib/projects";

interface SitePage {
  id: string;
  title: string;
  desc: string;
  href: string;
  category: "Page" | "Project";
  color?: string;
  tag?: string;
  year?: string;
  thumbnail?: string;
  tech?: string[];
}

const SITE_PAGES: SitePage[] = [
  { id: "home",     title: "Home",     desc: "Welcome — designer & developer portfolio.",          href: "/",        category: "Page", color: "#a5b4fc" },
  { id: "projects", title: "Projects", desc: "A selection of work across design and engineering.", href: "/projects", category: "Page", color: "#86efac" },
  { id: "about",    title: "About",    desc: "Background, experience, skills, and more.",          href: "/about",    category: "Page", color: "#fde68a" },
  { id: "contact",  title: "Contact",  desc: "Get in touch — always open to new projects.",        href: "/contact",  category: "Page", color: "#f9a8d4" },
];

const ALL_PAGES: SitePage[] = [
  ...SITE_PAGES,
  ...PROJECTS.map((p) => ({
    id: p.slug,
    title: p.title,
    desc: p.desc,
    href: `/projects/${p.slug}`,
    category: "Project" as const,
    color: "#86efac",
    tag: p.tag,
    year: p.year,
    thumbnail: p.thumbnail,
    tech: p.tech,
  })),
];

function PageRow({ page }: { page: SitePage }) {
  return (
    <TransitionLink
      href={page.href}
      className="group flex items-center gap-5 border-b border-border hover:border-muted transition-colors py-5"
    >
      <span className="shrink-0 w-2 h-2 rounded-full" style={{ backgroundColor: page.color }} />
      <div className="flex-1 min-w-0">
        <p
          className="text-lg text-foreground group-hover:text-muted transition-colors"
          style={{ fontFamily: "var(--font-strawford)" }}
        >
          {page.title}
        </p>
        <p
          className="text-sm text-muted truncate"
          style={{ fontFamily: "var(--font-strawford)" }}
        >
          {page.desc}
        </p>
      </div>
      <span className="shrink-0 text-muted group-hover:text-foreground transition-colors text-lg">
        →
      </span>
    </TransitionLink>
  );
}

function SearchProjectCard({ page }: { page: SitePage }) {
  const isVideo = page.thumbnail ? isVideoThumbnail(page.thumbnail) : false;

  return (
    <TransitionLink
      href={page.href}
      className="group flex flex-col rounded-2xl bg-surface border border-border hover:border-muted transition-colors overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-background">
        {page.thumbnail && (
          isVideo ? (
            <VideoThumbnail
              src={page.thumbnail}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={page.thumbnail}
              alt={page.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          )
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
          <span
            className="text-xs uppercase tracking-widest text-white/80"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            {page.tag} · {page.year}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2
          className="text-2xl font-normal text-foreground"
          style={{ fontFamily: "var(--font-knile)" }}
        >
          {page.title}
        </h2>
        <p
          className="text-sm text-muted leading-relaxed flex-1"
          style={{ fontFamily: "var(--font-strawford)" }}
        >
          {page.desc}
        </p>
        {page.tech && (
          <div className="flex flex-wrap gap-2 pt-1">
            {page.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs rounded-full bg-background border border-border text-muted"
                style={{ fontFamily: "var(--font-strawford)" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </TransitionLink>
  );
}

export default function SearchPageClient() {
  const params = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  const syncUrl = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      const next = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search";
      router.replace(next, { scroll: false });
    },
    [router]
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => syncUrl(value), 300);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return ALL_PAGES;
    return ALL_PAGES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tag?.toLowerCase().includes(q) ||
        p.tech?.some((t) => t.toLowerCase().includes(q))
    );
  }, [q]);

  const pages = results.filter((p) => p.category === "Page");
  const projects = results.filter((p) => p.category === "Project");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      syncUrl(query);
    }
    if (e.key === "Escape") {
      setQuery("");
      router.replace("/search", { scroll: false });
      inputRef.current?.focus();
    }
  };

  return (
    <section className="px-6 sm:px-12 pt-10 sm:pt-14 pb-16 w-full">

      {/* Title + search */}
      <h1
        className="text-5xl sm:text-7xl font-normal text-foreground mb-10"
        style={{ fontFamily: "var(--font-knile)" }}
      >
        Search
      </h1>
      <input
        ref={inputRef}
        autoFocus
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type to search…"
        className="w-full max-w-2xl px-0 py-3 border-b border-border bg-transparent text-foreground placeholder:text-muted text-xl outline-none transition-colors focus:border-foreground"
        style={{ fontFamily: "var(--font-strawford)" }}
      />

      <p
        className="text-xs uppercase tracking-widest text-muted mt-12 mb-12"
        style={{ fontFamily: "var(--font-strawford)" }}
      >
        {q
          ? `${results.length} result${results.length !== 1 ? "s" : ""} for “${query.trim()}”`
          : "All pages & projects"}
      </p>

      {results.length === 0 && (
        <div className="max-w-xl">
          <p
            className="text-4xl sm:text-5xl font-normal text-foreground mb-4"
            style={{ fontFamily: "var(--font-knile)" }}
          >
            No results
          </p>
          <p
            className="text-lg text-muted mb-8 leading-relaxed"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            Nothing matched &ldquo;{query.trim()}&rdquo;. Try a different term.
          </p>
          <TransitionLink
            href="/"
            className="text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4"
            style={{ fontFamily: "var(--font-strawford)" }}
          >
            ← Back home
          </TransitionLink>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-16">

          {pages.length > 0 && (
            <div className="max-w-2xl">
              <p
                className="text-xs uppercase tracking-widest text-muted mb-5"
                style={{ fontFamily: "var(--font-strawford)" }}
              >
                Pages
              </p>
              <div className="border-t border-border">
                {pages.map((p) => (
                  <PageRow key={p.id} page={p} />
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <p
                className="text-xs uppercase tracking-widest text-muted mb-5"
                style={{ fontFamily: "var(--font-strawford)" }}
              >
                Projects
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <SearchProjectCard key={p.id} page={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </section>
  );
}
