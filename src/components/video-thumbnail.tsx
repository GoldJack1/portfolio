"use client";

import { useRef, useEffect, useState } from "react";

type VideoThumbnailProps = {
  src: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
};

export default function VideoThumbnail({
  src,
  poster,
  className = "",
  ariaLabel,
}: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "100px", threshold: 0.1 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
}
