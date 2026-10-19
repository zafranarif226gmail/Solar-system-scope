import { useId } from "react";

/** Hand-drawwn geometry: a rub-el-hizb star with a crescent inside. Scales to 16px. */
export function Monogram({
  className = "",
  stroke = "currentColor",
  fill = "none",
  crescent = "currentColor",
}: {
  className?: string;
  stroke?: string;
  fill?: string;
  crescent?: string;
}) {
  return (
    <svg viewBox="-64 -64 128 128" className={className} aria-hidden="true">
      <g fill={fill} stroke={stroke} strokeWidth="6" strokeLinejoin="round">
        <rect x="-46" y="-46" width="92" height="92" />
        <rect x="-46" y="-46" width="92" height="92" transform="rotate(45)" />
        <circle r="34" strokeWidth="4" />
      </g>
      <path
        d="M 8 -18 A 18 18 0 1 0 8 18 A 14 14 0 1 1 8 -18 Z"
        fill={crescent}
        stroke="none"
      />
    </svg>
  );
}

/** Small 8-point star used as a bullet / separator. */
export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <path
        d="M0,-46 L11,-16 L38,-27 L22,-4 L46,0 L22,4 L38,27 L11,16 L0,46 L-11,16 L-38,27 L-22,4 L-46,0 L-22,-4 L-38,-27 L-11,-16 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const archPath = (w: number, h: number) =>
  `M0,${h} L0,${h * 0.5} C0,${h * 0.22} ${w * 0.2},${h * 0.17} ${w * 0.5},0 C${w * 0.8},${
    h * 0.17
  } ${w},${h * 0.22} ${w},${h * 0.5} L${w},${h} Z`;

/** Every image in this app lives inside a pointed arch. */
export function ArchImage({
  src,
  alt,
  w,
  h,
  className = "",
  stroke = "#463b31",
  objectPosition = "50% 50%",
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  className?: string;
  stroke?: string;
  objectPosition?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const d = archPath(w, h);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label={alt}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <rect width={w} height={h} fill="#efe3ce" clipPath={`url(#clip-${id})`} />
      <image
        href={src}
        width={w}
        height={h}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#clip-${id})`}
        style={{ objectPosition }}
      />
      <path d={d} fill="none" stroke={stroke} strokeWidth={2.5} />
      <path
        d={archPath(w - 22, h - 18)}
        transform="translate(11,9)"
        fill="none"
        stroke="#e9a227"
        strokeWidth={1.25}
        opacity={0.75}
      />
    </svg>
  );
}

export function ArchOutline({
  w,
  h,
  className = "",
  stroke = "#e9a227",
  width = 2,
}: {
  w: number;
  h: number;
  className?: string;
  stroke?: string;
  width?: number;
}) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden="true">
      <path
        d={archPath(w, h)}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinejoin="round"
      />
    </svg>
  );
}
