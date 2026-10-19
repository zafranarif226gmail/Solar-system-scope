import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const P = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
};

const poly = (r: number, n: number, off = 0) =>
  Array.from({ length: n }, (_, i) => P(r, off + (i * 360) / n)).join(" ");

const star = (R: number, r: number, points: number, off = -90) => {
  const out: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? R : r;
    out.push(P(rad, off + (i * 180) / points));
  }
  return out.join(" ");
};

const SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = i * 45 + 22.5;
  return `M${P(96, a)} L${P(172, a)}`;
});

const D = 1600; // drawing window
const COUNT_START = 300;
const COUNT_END = 2500;
const SPLIT_AT = 2800;
const DONE_AT = 3700;

export default function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [pct, setPct] = useState(0);
  const [splitting, setSplitting] = useState(false);
  const fired = useRef(false);

  const finish = () => {
    if (fired.current) return;
    fired.current = true;
    onDone();
  };

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(finish, 500);
      return () => clearTimeout(t);
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      const raw = Math.min(1, Math.max(0, (t - COUNT_START) / (COUNT_END - COUNT_START)));
      const eased = 1 - Math.pow(2, -10 * raw);
      setPct(Math.round(Math.min(1, raw === 1 ? 1 : eased) * 100));
      if (raw < 1) raf = requestAnimationFrame(tick);
      else setPct(100);
    };
    raf = requestAnimationFrame(tick);

    const a = setTimeout(() => setSplitting(true), SPLIT_AT);
    const b = setTimeout(finish, DONE_AT);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(a);
      clearTimeout(b);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const skip = () => {
    if (fired.current) return;
    setSplitting(true);
    setTimeout(finish, 750);
  };

  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: {
      pathLength: { duration: reduced ? 0.01 : D / 1000, delay: reduced ? 0 : delay, ease: "easeInOut" as const },
      opacity: { duration: 0.2, delay: reduced ? 0 : delay },
    },
  });

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer select-none"
      onClick={skip}
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onKeyDown={(e) => e.key === "Enter" && skip()}
    >
      {/* the two leaves of the book */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-teal-deep"
        animate={{ x: splitting ? "-101%" : "0%" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-teal-deep"
        animate={{ x: splitting ? "101%" : "0%" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute left-1/2 top-0 h-full w-px bg-saffron/70"
        initial={{ scaleY: 0, opacity: 1 }}
        animate={{ scaleY: splitting ? 1 : 1, opacity: splitting ? 0 : 1 }}
        style={{ transformOrigin: "top" }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6"
        animate={{ opacity: splitting ? 0 : 1, scale: splitting ? 0.94 : 1 }}
        transition={{ duration: 0.45, ease: "easeIn" }}
      >
        <motion.div
          className="label mb-6 text-saffron/80"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Est. Kuala Lumpur · Songs for children
        </motion.div>

        <div className="relative w-[min(78vw,440px)]">
          <svg viewBox="-210 -210 420 420" className="w-full overflow-visible">
            <motion.circle
              r={196}
              fill="none"
              stroke="#17877e"
              strokeWidth={1}
              {...draw(0.05)}
            />
            <motion.polygon
              points={poly(182, 8, -90)}
              fill="none"
              stroke="#17877e"
              strokeWidth={1.5}
              {...draw(0.15)}
            />
            <motion.polygon
              points={poly(174, 4, -45)}
              fill="none"
              stroke="#e9a227"
              strokeWidth={2}
              strokeLinejoin="round"
              {...draw(0.3)}
            />
            <motion.polygon
              points={poly(174, 4, -90)}
              fill="none"
              stroke="#e9a227"
              strokeWidth={2}
              strokeLinejoin="round"
              {...draw(0.42)}
            />
            <motion.polygon
              points={star(156, 68, 8)}
              fill="none"
              stroke="#f7efe1"
              strokeWidth={2.5}
              strokeLinejoin="round"
              {...draw(0.62)}
            />
            <motion.polygon
              points={poly(104, 8, -90)}
              fill="none"
              stroke="#17877e"
              strokeWidth={1.5}
              {...draw(0.86)}
            />
            <motion.polygon
              points={star(96, 42, 8)}
              fill="none"
              stroke="#e9a227"
              strokeWidth={1.5}
              strokeLinejoin="round"
              {...draw(1.0)}
            />
            <motion.circle
              r={54}
              fill="none"
              stroke="#f7efe1"
              strokeWidth={1}
              {...draw(1.15)}
            />
            {SPOKES.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="#17877e"
                strokeWidth={1.5}
                {...draw(1.2 + i * 0.045)}
              />
            ))}
            <motion.g
              initial={{ scale: 0.3, opacity: 0, rotate: -60 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "center" }}
            >
              <g transform="translate(0,-114) scale(0.6)">
                <path
                  d="M 14 -30 A 30 30 0 1 0 14 30 A 23 23 0 1 1 14 -30 Z"
                  fill="#e9a227"
                />
              </g>
            </motion.g>
          </svg>

          {/* the counter sits inside the star */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="flex -translate-x-[16%] items-baseline font-display text-paper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <span
                className="tnum text-[clamp(2.75rem,11vw,5rem)] font-black leading-none tracking-tight"
                style={{ textShadow: "0 2px 18px rgba(10,66,62,0.55)" }}
              >
                {pct}
              </span>
              <span className="ml-1 text-sm font-medium text-saffron">%</span>
            </motion.div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden">
          <div className="flex justify-center">
            {"OMAR & HANA".split("").map((c, i) => (
              <motion.span
                key={`${c}-${i}`}
                className="font-display text-[clamp(1.75rem,6vw,3rem)] font-black tracking-[0.06em] text-paper"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 1.55 + i * 0.045,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {c === " " ? "\u00A0" : c}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.p
          className="label mt-4 text-center text-paper/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}
        >
          Songs &amp; stories for little hearts
        </motion.p>

        <motion.button
          className="label absolute bottom-8 right-6 border border-paper/35 px-4 py-2 text-paper/80 transition-colors hover:border-saffron hover:text-saffron md:right-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          onClick={(e) => {
            e.stopPropagation();
            skip();
          }}
        >
          Skip intro
        </motion.button>
      </motion.div>
    </div>
  );
}
