"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PiPauseFill, PiPlayFill, PiSpeakerHighFill, PiSpeakerSlashFill } from "react-icons/pi";
import type { HeroVideo as HeroVideoData } from "@/lib/data";

/** Starting frame: up to 560px wide (86% of small screens), 16:9. */
const MAX_START_WIDTH = 560;
const START_WIDTH_RATIO = 0.86;
const ASPECT = 9 / 16;
const START_RADIUS = 12;
/** Fraction of the scroll track used for growing; the rest holds the full-screen frame. */
const GROW_PORTION = 0.82;

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
/** Lets the browser skip formats it can't play; unknown extensions are left for it to sniff. */
const sourceType = (src: string) => {
  const ext = src.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  return ext === "webm" ? "video/webm" : ext === "mp4" || ext === "m4v" ? "video/mp4" : undefined;
};

/**
 * Hero video that starts as a small frame under the headline and grows to full screen as you scroll.
 * The frame box itself resizes inside a sticky stage, so the video always fills the frame at its
 * current size (scaled, not cropped to a window). It's absolutely positioned and contained, so the
 * resize stays local, and a light lerp on the scroll position keeps the motion smooth.
 */
export function HeroVideo({ video }: { video: HeroVideoData }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
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
    if (!track || !stage || !frame) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let current = 0;
    let raf = 0;
    let trackTop = 0;
    let trackHeight = 0;
    let vw = 0;
    let vh = 0;
    let header = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      trackHeight = rect.height;
      vw = stage.clientWidth;
      vh = stage.clientHeight;
      // A sticky site header covers the top of the stage; centre the growing frame in the space below it.
      const h = document.querySelector("header");
      header = h && getComputedStyle(h).position !== "static" ? h.getBoundingClientRect().height : 0;
    };

    const readTarget = () => {
      // Grows from the very first pixel of scroll until the end of the growth portion of the track.
      const distance = (trackTop + trackHeight - vh) * GROW_PORTION;
      target = distance > 0 ? clamp(window.scrollY / distance) : 1;
    };

    const paint = (p: number) => {
      const e = smoothstep(p);
      const w0 = Math.min(MAX_START_WIDTH, vw * START_WIDTH_RATIO);
      const h0 = w0 * ASPECT;
      const w = w0 + (vw - w0) * e;
      const h = h0 + (vh - h0) * e;
      const side = (vw - w) / 2;
      // Starts directly under the hero copy, then eases to the visual centre as the stage pins.
      const pin = smoothstep(trackTop > 0 ? clamp(window.scrollY / trackTop) : 1);
      const top = Math.max(0, Math.min(header + (vh - header - h) / 2, vh - h)) * pin;
      const r = START_RADIUS * (1 - e);
      // The frame itself resizes, so the whole video is always fitted to it (never a cropped window).
      frame.style.left = `${side}px`;
      frame.style.top = `${top}px`;
      frame.style.width = `${w}px`;
      frame.style.height = `${h}px`;
      frame.style.borderRadius = `${r}px`;
    };

    const tick = () => {
      const diff = target - current;
      current = Math.abs(diff) < 0.0005 ? target : current + diff * 0.14;
      paint(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readTarget();
      if (reduce) {
        current = target;
        paint(current);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      readTarget();
      current = target;
      paint(current);
    };

    onResize();
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
          className="absolute overflow-hidden bg-ink-3 [contain:layout_paint]"
          // First paint (before JS): the same small starting frame, so nothing jumps on hydration.
          style={{
            left: "calc(50% - min(280px, 43vw))",
            top: 0,
            width: "min(560px, 86vw)",
            height: "calc(min(560px, 86vw) * 0.5625)",
            borderRadius: START_RADIUS,
          }}
        >
          <div className="absolute inset-0">
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
            <div className="absolute right-3 bottom-3 flex gap-2 sm:right-4 sm:bottom-4">
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
