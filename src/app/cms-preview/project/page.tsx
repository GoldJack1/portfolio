"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/project-types";
import ProjectDetailContent from "@/components/project-detail-content";

export default function CmsProjectPreviewPage() {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.data?.type !== "cms-project-preview") return;
      setProject(event.data.payload as Project);
    }

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "cms-project-preview-ready" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!project?.title) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-muted">
        <p>Project preview will appear here as you edit.</p>
      </div>
    );
  }

  return <ProjectDetailContent project={project} />;
}
