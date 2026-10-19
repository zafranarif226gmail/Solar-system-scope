import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Monogram } from "./Mark";
import { fmt, type Track } from "../lib/data";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoading = false;
let apiReady = false;
const readyQueue: Array<() => void> = [];

const loadYouTubeApi = (cb: () => void) => {
  if (apiReady) {
    cb();
    return;
  }
  readyQueue.push(cb);
  if (apiLoading) return;
  apiLoading = true;

  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    apiReady = true;
    readyQueue.forEach((fn) => fn());
    readyQueue.length = 0;
    prev?.();
  };

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.async = true;
  document.head.appendChild(script);
};

export default function VideoPlayer({
  track,
  playing,
  elapsed,
  duration,
  onToggle,
  onPrev,
  onNext,
  onSeek,
  onPlayPause,
  onProgress,
  onEnded,
}: {
  track: Track;
  playing: boolean;
  elapsed: number;
  duration: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (sec: number) => void;
  onPlayPause: (playing: boolean) => void;
  onProgress: (elapsed: number, duration: number) => void;
  onEnded: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const pollRef = useRef<number | null>(null);
  const wantPlayRef = useRef(playing);
  const lastVideoRef = useRef(track.videoId);
  const trackRef = useRef(track);
  trackRef.current = track;
  const [ready, setReady] = useState(false);
  const [broken, setBroken] = useState(false);

  const stopPoll = () => {
    if (pollRef.current != null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startPoll = () => {
    stopPoll();
    pollRef.current = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const t = Number(p.getCurrentTime?.() || 0);
        const d = Number(p.getDuration?.() || 0);
        if (d > 0) onProgress(t, d);
      } catch {
        /* ignore */
      }
    }, 500);
  };

  // create the YouTube player once
  useEffect(() => {
    let cancelled = false;
    const failTimer = window.setTimeout(() => setBroken(true), 9000);

    loadYouTubeApi(() => {
      if (cancelled || !mountRef.current || playerRef.current) return;
      const YT = window.YT;
      if (!YT) {
        setBroken(true);
        return;
      }

      try {
        playerRef.current = new YT.Player(mountRef.current, {
          width: "100%",
          height: "100%",
          videoId: trackRef.current.videoId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              window.clearTimeout(failTimer);
              setReady(true);
              lastVideoRef.current = trackRef.current.videoId;
              if (wantPlayRef.current) playerRef.current?.playVideo?.();
            },
            onStateChange: (e: any) => {
              if (e.data === YT.PlayerState.PLAYING) {
                onPlayPause(true);
                startPoll();
              } else if (e.data === YT.PlayerState.PAUSED) {
                onPlayPause(false);
                stopPoll();
              } else if (e.data === YT.PlayerState.ENDED) {
                onPlayPause(false);
                stopPoll();
                onEnded();
              } else if (e.data === YT.PlayerState.UNSTARTED && wantPlayRef.current) {
                playerRef.current?.playVideo?.();
              }
            },
            onError: () => setBroken(true),
          },
        });
        lastVideoRef.current = trackRef.current.videoId;
      } catch {
        setBroken(true);
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(failTimer);
      stopPoll();
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // follow external play/pause requests
  useEffect(() => {
    wantPlayRef.current = playing;
    const p = playerRef.current;
    if (!p) return;
    try {
      if (playing) p.playVideo?.();
      else p.pauseVideo?.();
    } catch {
      /* ignore */
    }
  }, [playing]);

  // load a new official video when the track changes
  useEffect(() => {
    if (lastVideoRef.current === track.videoId) return;
    lastVideoRef.current = track.videoId;
    wantPlayRef.current = playing;
    const p = playerRef.current;
    if (!p) return;
    try {
      if (playing) p.loadVideoById?.(track.videoId);
      else p.cueVideoById?.(track.videoId);
    } catch {
      /* ignore */
    }
  }, [track.videoId, playing]);

  const ratio = duration > 0 ? Math.min(1, elapsed / duration) : 0;

  const seek = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ready || duration <= 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const next = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * duration;
    onSeek(next);
    try {
      playerRef.current?.seekTo?.(next, true);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-saffron bg-teal-deep text-paper shadow-[0_-14px_40px_rgba(10,66,62,0.28)]">
      <div
        onClick={seek}
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        onKeyDown={(e) => {
          if (duration <= 0) return;
          if (e.key === "ArrowRight") onSeek(Math.min(duration, elapsed + 5));
          if (e.key === "ArrowLeft") onSeek(Math.max(0, elapsed - 5));
        }}
        className="group relative h-2.5 w-full cursor-pointer bg-paper/12 transition-[height] hover:h-4"
      >
        <div
          className="absolute inset-y-0 left-0 bg-saffron"
          style={{ width: `${ratio * 100}%` }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-teal-deep bg-pom"
          style={{ left: `${ratio * 100}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-3 py-3 sm:gap-5 sm:px-6 lg:px-10">
        <div className="relative h-20 w-[142px] shrink-0 overflow-hidden bg-black/70 sm:h-[94px] sm:w-[168px]">
          <div ref={mountRef} className="absolute inset-0" />
          {broken && (
            <div className="absolute inset-0 grid place-items-center bg-teal-deep/95 p-2 text-center">
              <a
                href={`https://www.youtube.com/watch?v=${track.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="label text-saffron underline underline-offset-4"
              >
                Open on YouTube
              </a>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="tnum shrink-0 text-[11px] font-semibold text-saffron">
              {track.n.toString().padStart(2, "0")}
            </span>
            <span className="truncate font-display text-base font-semibold leading-tight sm:text-lg">
              {track.title}
            </span>
          </div>
          <div className="label truncate text-paper/70">
            {track.translit ?? track.theme}
            <span className="mx-2 text-saffron">✦</span>
            <span className="text-paper/65">{track.source}</span>
            <span className="mx-2 text-paper/40">·</span>
            <span className="text-paper/65">official YouTube</span>
          </div>
        </div>

        <div className="tnum hidden shrink-0 text-sm text-paper/80 sm:block">
          {fmt(elapsed)}
          <span className="mx-1.5 text-paper/30">/</span>
          {duration > 0 ? fmt(duration) : track.dur}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={onPrev}
            aria-label="Previous track"
            className="hidden h-9 w-9 place-items-center text-paper/70 transition-colors hover:text-saffron sm:grid"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
            </svg>
          </button>

          <button
            onClick={onToggle}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-11 w-11 place-items-center rounded-full bg-paper text-teal-deep transition-transform hover:scale-105 active:scale-95 sm:h-12 sm:w-12"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" />
                <rect x="14" y="5" width="4" height="14" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                <path d="M7 4v16l13-8z" />
              </svg>
            )}
          </button>

          <button
            onClick={onNext}
            aria-label="Next track"
            className="grid h-9 w-9 place-items-center text-paper/70 transition-colors hover:text-saffron"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
            </svg>
          </button>

          <a
            href={`https://www.youtube.com/watch?v=${track.videoId}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Open on YouTube"
            className="hidden h-9 w-9 place-items-center text-paper/70 transition-colors hover:text-saffron md:grid"
          >
            <Monogram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
