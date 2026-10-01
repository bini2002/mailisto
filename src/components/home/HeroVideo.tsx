"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PiPauseFill, PiPlayFill, PiSpeakerHighFill, PiSpeakerSlashFill } from "react-icons/pi";
import type { HeroVideo as HeroVideoData } from "@/lib/data";

/** Starting frame: up to 560px wide (72% of small screens), 16:9. */
const MAX_START_WIDTH = 560;
const START_WIDTH_RATIO = 0.72;
const ASPECT = 9 / 16;
/** The frame stops growing at 80% of the screen (below the sticky header). */
const END_SCALE = 0.8;
const START_RADIUS = 12;
const END_RADIUS = 18;
/** Fraction of the scroll track used for growing; the rest holds the finished frame. */
const GROW_PORTION = 0.85;
/** Smoothing time constant (ms): how softly the frame catches up with the scroll position. */
const SMOOTHING_MS = 140;

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
/** Lets the browser skip formats it can't play; unknown extensions are left for it to sniff. */
const sourceType = (src: string) => {
  const ext = src.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  return ext === "webm" ? "video/webm" : ext === "mp4" || ext === "m4v" ? "video/mp4" : undefined;
};

/**
 * Hero video that starts as a small frame under the headline and grows to 80% of the screen as you scroll.
 * The frame is laid out once at its finished size; growth is a uniform scale of the video plus a
 * clip-path, and the motion is a transform, so scrolling never re-lays out or resizes the video.
 * A frame-rate independent ease on the scroll position keeps it smooth on wheels, trackpads and touch.
 */
export function HeroVideo({ video }: { video: HeroVideoData }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);
  const hasVideo = Boolean(video.src);

  // ---- Scroll-linked growth -------------------------------------------------
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!track || !stage || !frame || !media) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = window.scrollY;
    let current = target;
    let raf = 0;
    let last = 0;
    let trackTop = 0;
    let growEnd = 1;
    let vw = 0;
    let header = 0;
    let avail = 0;
    // Finished frame box (stage coordinates).
    let W = 0;
    let H = 0;
    let L = 0;
    let T = 0;
    // The video box: 16:9, just big enough to cover the finished frame.
    let MW = 0;
    let MH = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      const vh = stage.clientHeight;
      vw = stage.clientWidth;
      // A sticky site header covers the top of the stage; the frame is centred in the space below it.
      const h = document.querySelector("header");
      header = h && getComputedStyle(h).position !== "static" ? h.getBoundingClientRect().height : 0;
      avail = vh - header;
      growEnd = Math.max(1, (trackTop + rect.height - vh) * GROW_PORTION);
      W = vw * END_SCALE;
      H = avail * END_SCALE;
      L = (vw - W) / 2;
      T = header + (avail - H) / 2;
      Object.assign(frame.style, { left: `${L}px`, top: `${T}px`, right: "auto", bottom: "auto", width: `${W}px`, height: `${H}px` });
      MW = Math.max(W, H / ASPECT);
      MH = MW * ASPECT;
      Object.assign(media.style, { left: `${(W - MW) / 2}px`, top: `${(H - MH) / 2}px`, width: `${MW}px`, height: `${MH}px` });
    };

    const paint = (y: number) => {
      const e = smoothstep(clamp(y / growEnd));
      const w0 = Math.min(MAX_START_WIDTH, vw * START_WIDTH_RATIO, W);
      const h0 = Math.min(w0 * ASPECT, H);
      const w = w0 + (W - w0) * e;
      const h = h0 + (H - h0) * e;
      // Rides up with the page directly under the hero copy until it reaches the centre, then holds there.
      const stageTop = Math.max(0, trackTop - y);
      const top = Math.max(0, header + (avail - h) / 2 - stageTop);
      const dy = top + h / 2 - (T + H / 2);
      const ix = (W - w) / 2;
      const iy = (H - h) / 2;
      const r = START_RADIUS + (END_RADIUS - START_RADIUS) * e;
      frame.style.transform = `translate3d(0, ${dy}px, 0)`;
      frame.style.clipPath = `inset(${iy}px ${ix}px round ${r}px)`;
      // Uniform scale so the video covers the visible frame, never stretched. In the small 16:9
      // frame this shows the whole shot; it only crops if the finished frame isn't 16:9 (phones).
      media.style.transform = `scale(${Math.max(w / MW, h / MH)})`;
      if (controlsRef.current) controlsRef.current.style.transform = `translate3d(${-ix}px, ${-iy}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const diff = target - current;
      current = Math.abs(diff) < 0.5 ? target : current + diff * (1 - Math.exp(-dt / SMOOTHING_MS));
      paint(current);
      if (current === target) {
        raf = 0;
        last = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      target = window.scrollY;
      if (reduce) {
        current = target;
        paint(current);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      target = current = window.scrollY;
      paint(current);
    };

    onResize();
    frame.classList.add("is-ready");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ---- Playback: muted autoplay, pause off-screen, respect reduced motion ----
  useEffect(() => {
    const v = videoRef.current;
    const stage = stageRef.current;
    if (!v || !stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      userPaused.current = true;
      v.pause();
    }
    // Autoplay can start before hydration attaches onPlay, so read the real state once.
    setPlaying(!v.paused);
    setMuted(v.muted);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    }
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }, []);

  return (
    <div ref={trackRef} className="relative h-[200vh] sm:h-[240vh]">
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={frameRef}
          // Laid out at its finished size by JS; hidden until then so nothing jumps on hydration.
          className="hero-frame absolute inset-x-[10%] top-[10%] bottom-[10%] overflow-hidden bg-ink-3 will-change-transform"
          style={{ clipPath: `inset(0px round ${END_RADIUS}px)` }}
        >
          <div ref={mediaRef} className="absolute inset-0 will-change-transform">
            {hasVideo ? (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                poster={video.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                aria-label="Mailisto showreel"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
              >
                {video.webm && <source src={video.webm} type="video/webm" />}
                <source src={video.src!} type={sourceType(video.src!)} />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video.poster} alt="" className="h-full w-full object-contain" />
            )}
          </div>
          {hasVideo && (
            <div ref={controlsRef} className="absolute right-3 bottom-3 flex gap-2 will-change-transform sm:right-4 sm:bottom-4">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause video" : "Play video"}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-colors hover:border-lime hover:text-lime"
              >
                {playing ? <PiPauseFill aria-hidden="true" className="size-4" /> : <PiPlayFill aria-hidden="true" className="size-4" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Unmute video" : "Mute video"}
                aria-pressed={!muted}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-black/55 px-3.5 text-xs font-medium tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:border-lime hover:text-lime"
              >
                {muted ? <PiSpeakerSlashFill aria-hidden="true" className="size-4" /> : <PiSpeakerHighFill aria-hidden="true" className="size-4" />}
                <span>{muted ? "Sound off" : "Sound on"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
