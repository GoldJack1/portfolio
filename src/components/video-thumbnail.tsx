"use client";

import { useRef, useEffect } from "react";

type VideoThumbnailProps = {
  src: string;
  className?: string;
  ariaLabel?: string;
};

export default function VideoThumbnail({ src, className = "", ariaLabel }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
}
