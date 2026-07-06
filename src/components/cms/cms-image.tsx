type CmsImageProps = {
  src?: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
};

/** CMS images may be any HTTPS URL from the editor — avoid Next image optimization at build time. */
export default function CmsImage({
  src,
  alt = "",
  className = "",
  sizes,
  priority,
  fill,
}: CmsImageProps) {
  if (!src) return null;

  const classes = fill
    ? `absolute inset-0 h-full w-full object-cover ${className}`
    : `h-full w-full object-cover ${className}`;

  return (
    // Native img: CMS URLs are user-controlled and not known at build time.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={classes}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
