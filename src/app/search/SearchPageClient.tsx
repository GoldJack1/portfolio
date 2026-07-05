"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import TransitionLink from "@/components/transition-link";
import ProjectCard from "@/components/project-card";
import {
  searchPages,
  searchProjects,
  searchSite,
  type SearchResult,
} from "@/lib/site-search";
import { decoMedium, sansBold, sansLight, sansMedium } from "@/lib/typography";

function PageRow({ page }: { page: SearchResult }) {
  return (
    <TransitionLink
      href={page.href}
      className="group flex items-center gap-5 border-b border-border hover:border-muted transition-colors py-5"
    >
      <div className="flex-1 min-w-0">
        <p className={`text-lg text-foreground group-hover:text-muted transition-colors ${sansBold}`}>
          {page.title}
        </p>
        <p className={`text-sm text-muted truncate ${sansLight}`}>
          {page.desc}
        </p>
      </div>
      <span className={`shrink-0 text-xs uppercase tracking-widest text-muted ${sansLight}`}>
        {page.category}
      </span>
      <span className="shrink-0 text-muted group-hover:text-foreground transition-colors text-lg">
        →
      </span>
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
    [router],
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => syncUrl(value), 300);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const q = query.trim();

  const pages = useMemo(() => searchPages(q), [q]);
  const projects = useMemo(() => searchProjects(q), [q]);
  const resultCount = useMemo(() => {
    if (!q) return searchSite("").length;
    return searchSite(q).length;
  }, [q]);

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
      <h1 className={`text-5xl sm:text-7xl ${decoMedium} text-foreground mb-4`}>
        Search
      </h1>

      <input
        ref={inputRef}
        autoFocus
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type to search…"
        className={`w-full px-0 py-3 mb-16 border-b border-border bg-transparent text-foreground placeholder:text-muted text-lg sm:text-xl outline-none transition-colors focus:border-foreground max-w-xl ${sansMedium}`}
      />

      <p className={`text-xs uppercase tracking-widest text-muted mb-12 ${sansLight}`}>
        {q
          ? `${resultCount} result${resultCount !== 1 ? "s" : ""} for “${query.trim()}”`
          : "All pages & projects"}
      </p>

      {resultCount === 0 && (
        <div className="max-w-xl">
          <p className={`text-4xl sm:text-5xl ${decoMedium} text-foreground mb-4`}>
            No results
          </p>
          <p className="text-lg text-muted mb-8 leading-relaxed">
            Nothing matched &ldquo;{query.trim()}&rdquo;. Try a different term.
          </p>
          <TransitionLink
            href="/"
            className={`text-sm text-muted hover:text-foreground transition-colors underline underline-offset-4 ${sansLight}`}
          >
            ← Back home
          </TransitionLink>
        </div>
      )}

      {resultCount > 0 && (
        <div className="flex flex-col gap-16">
          {pages.length > 0 && (
            <div>
              <p className={`text-xs uppercase tracking-widest text-muted mb-5 ${sansLight}`}>
                Pages & content
              </p>
              <div className="border-t border-border max-w-xl">
                {pages.map((page) => (
                  <PageRow key={page.id} page={page} />
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <p className={`text-xs uppercase tracking-widest text-muted mb-5 ${sansLight}`}>
                Projects
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
