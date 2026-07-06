import CmsImage from "./cms-image";
import type { CmsImageDisplay } from "@/lib/cms/image-display";
import { imageFitClass, imageFrameShellClasses } from "@/lib/cms/image-display";

type CmsImageFrameProps = {
  src: string;
  alt?: string;
  display?: CmsImageDisplay;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function CmsImageFrame({
  src,
  alt = "",
  display = {},
  sizes = "100vw",
  priority,
  className = "",
}: CmsImageFrameProps) {
  const aspect = display.aspect ?? "video";
  const shellClass = imageFrameShellClasses(display);
  const fitClass = imageFitClass(display);

  if (aspect === "auto") {
    return (
      <div className={`${shellClass} ${className}`.trim()}>
        <CmsImage src={src} alt={alt} className={`w-full h-auto ${fitClass}`} sizes={sizes} priority={priority} />
      </div>
    );
  }

  return (
    <div className={`${shellClass} ${className}`.trim()}>
      <CmsImage src={src} alt={alt} fill className={fitClass} sizes={sizes} priority={priority} />
    </div>
  );
}
