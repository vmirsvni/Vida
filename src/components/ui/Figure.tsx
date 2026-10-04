import Image from "next/image";
import { getMedia2 } from "@/data/media2";
import { getMedia3 } from "@/data/media3";
import { getMedia4 } from "@/data/media4";

interface Props {
  name: string;
  /** CSS aspect-ratio, e.g. "4/5". Omit when the parent sizes the figure (fill). */
  ratio?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  reveal?: boolean;
  delay?: number;
  /** show the discreet «نمونه تصویری دمو» label */
  demoLabel?: boolean;
  quality?: number;
  alt?: string;
  /** which graded photo set to use (demo 2 rose · demo 3 paper · demo 4 lilac) */
  set?: "demo2" | "demo3" | "demo4";
  /** live CSS effects layered on top of the photo */
  fx?: "sheen"[];
}

/** Art-directed image: fixed ratio box, focal point from the manifest, AVIF/WebP via next/image. */
export function Figure({
  name,
  ratio,
  sizes,
  priority,
  className = "",
  imgClassName = "",
  reveal = true,
  delay = 0,
  demoLabel,
  quality = 80,
  alt,
  set = "demo4",
  fx = [],
}: Props) {
  const m = set === "demo3" ? getMedia3(name) : set === "demo2" ? getMedia2(name) : getMedia4(name);
  const fxClass = fx.map((f) => `fx-${f}`).join(" ");
  return (
    <div
      className={`fig group/fig relative overflow-hidden ${fxClass} ${className}`}
      style={{ aspectRatio: ratio, ["--d" as string]: `${delay}ms` }}
      data-reveal={reveal && !priority ? "image" : undefined}
    >
      <div className="fig-clip absolute inset-0 bg-nude">
        <Image
          src={m.src}
          alt={alt ?? m.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={m.blur ? "blur" : "empty"}
          blurDataURL={m.blur}
          className={`object-cover ${imgClassName}`}
          style={{ objectPosition: m.focal }}
        />
      </div>
      {fx.includes("sheen") && <span aria-hidden className="fx-sheen-layer" />}
      {demoLabel && m.isDemo && <span className="demo-tag absolute bottom-3 left-3 z-10">نمونه تصویری دمو</span>}
    </div>
  );
}
