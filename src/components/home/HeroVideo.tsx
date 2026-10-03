"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PiPauseFill, PiPlayFill, PiSpeakerHighFill, PiSpeakerSlashFill } from "react-icons/pi";
import type { HeroVideo as HeroVideoData } from "@/lib/data";

/** Starting frame on laptops and up: 560×315 (16:9). Must match `.hv-track` in globals.css. */
const START_WIDTH = 560;
const ASPECT = 9 / 16;
const RADIUS = 16;
/** Fraction of the pinned scroll used for growing; the rest holds the finished (80%) frame. */
const GROW_PORTION = 0.8;
/** Smoothing time constant (ms) for the growth, so wheel steps turn into one soft motion. */
const SMOOTHING_MS = 120;
const DESKTOP = "(min-width: 1024px)";
/** Playback starts (with sound) at 60%: of the growth on laptops, of the video in view on phones. */
const PLAY_AT = 0.6;
/** Pauses again only below this, so hovering around 60% doesn't flicker play/pause. */
const PAUSE_BELOW = 0.5;

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
/** Lets the browser skip formats it can't play; unknown extensions are left for it to sniff. */
const sourceType = (src: string) => {
  const ext = src.split(/[?#]/)[0].split(".").pop()?.toLowerCase();
  return ext === "webm" ? "video/webm" : ext === "mp4" || ext === "m4v" ? "video/mp4" : undefined;
};

/**
 * Hero video.
 * - Paused on landing. At 60% (of the growth on laptops, of the video in view on phones) it plays
 *   with sound. Browsers only allow sound after the visitor has interacted with the page, so if it's
 *   blocked the video plays muted and sound comes on with their next click, tap or key press.
 * - Phones and tablets: a plain responsive 16:9 video under the copy, no scroll effect.
 * - Laptops and up: a small frame under the copy that, once the stage pins, grows with the scroll to
 *   80% of the screen. Position is pure CSS (sticky stage, centred frame), so it never fights the
 *   browser's own scrolling; JS only sets the size, as a clip-path plus a uniform video scale, in
 *   whole pixels, which keeps edges steady instead of shimmering.
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
  const [soundBlocked, setSoundBlocked] = useState(false);
  const userPaused = useRef(false); // pressed pause: never auto-play again until they press play
  const userPlayed = useRef(false); // pressed play before 60%: keep playing
  const userMuted = useRef(false); // pressed mute: never auto-unmute
  const soundBlockedRef = useRef(false);
  /** Set by the playback effect; the scroll effect reports the growth progress to it. */
  const reportProgress = useRef<(p: number) => void>(() => {});
  const lastProgress = useRef(0);
  const hasVideo = Boolean(video.src);

  // ---- Scroll-linked growth (laptops and up only) -----------------------------
  useEffect(() => {
    const track = trackRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!track || !frame || !media) return;

    const mq = window.matchMedia(DESKTOP);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let current = 0;
    let raf = 0;
    let last = 0;
    let start = 0; // scroll position where the stage pins
    let distance = 1; // scroll distance over which the frame grows
    let W = 0; // finished frame
    let H = 0;
    let MW = 0; // 16:9 video box covering the finished frame
    let MH = 0;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      start = rect.top + window.scrollY;
      distance = Math.max(1, (rect.height - window.innerHeight) * GROW_PORTION);
      W = frame.clientWidth;
      H = frame.clientHeight;
      MW = media.offsetWidth;
      MH = media.offsetHeight;
    };

    const progress = () => clamp((window.scrollY - start) / distance);

    const paint = (p: number) => {
      const e = smoothstep(p);
      const w0 = Math.min(START_WIDTH, W);
      const h0 = Math.min(w0 * ASPECT, H);
      const w = w0 + (W - w0) * e;
      const h = h0 + (H - h0) * e;
      const ix = Math.round((W - w) / 2);
      const iy = Math.round((H - h) / 2);
      frame.style.clipPath = `inset(${iy}px ${ix}px round ${RADIUS}px)`;
      media.style.transform = `scale(${Math.max((W - 2 * ix) / MW, (H - 2 * iy) / MH).toFixed(4)})`;
      if (controlsRef.current) controlsRef.current.style.transform = `translate3d(${-ix}px, ${-iy}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const diff = target - current;
      current = Math.abs(diff) < 0.0008 ? target : current + diff * (1 - Math.exp(-dt / SMOOTHING_MS));
      paint(current);
      if (current === target) {
        raf = 0;
        last = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      target = lastProgress.current = progress();
      reportProgress.current(target);
      if (reduce) {
        current = target;
        paint(current);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      measure();
      target = current = lastProgress.current = progress();
      reportProgress.current(target);
      paint(current);
    };

    const enable = () => {
      onResize();
      frame.classList.add("is-ready");
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
    };

    const disable = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      frame.style.clipPath = "";
      media.style.transform = "";
      if (controlsRef.current) controlsRef.current.style.transform = "";
    };

    const sync = () => (mq.matches ? enable() : disable());
    const onChange = () => {
      disable();
      sync();
    };
    sync();
    mq.addEventListener("change", onChange);
    return () => {
      disable();
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // ---- Playback: paused on landing, plays with sound from 60% ------------------
  useEffect(() => {
    const v = videoRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!v || !stage || !frame) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia(DESKTOP);
    let armed = false; // reached 60%
    let onScreen = false;

    const setBlocked = (b: boolean) => {
      soundBlockedRef.current = b;
      setSoundBlocked(b);
    };

    const start = () => {
      if (!userMuted.current) v.muted = false;
      v.play().catch(() => {
        // Sound not allowed yet (no click/tap/key press on the page so far): play muted instead.
        if (v.muted) return;
        v.muted = true;
        setBlocked(true);
        v.play().catch(() => {});
      });
    };

    const update = () => {
      const go = onScreen && !userPaused.current && (userPlayed.current || (armed && !reduce));
      if (go && v.paused) start();
      else if (!go && !v.paused) v.pause();
    };

    const arm = (ratio: number) => {
      const next = armed ? ratio >= PAUSE_BELOW : ratio >= PLAY_AT;
      if (next === armed) return;
      armed = next;
      if (!armed) userPlayed.current = false;
      update();
    };

    // Laptops: the growth progress drives it.
    reportProgress.current = (p) => {
      if (desktop.matches) arm(p);
    };
    reportProgress.current(lastProgress.current); // e.g. a reload part-way down the page

    // Phones and tablets: how much of the video is in view drives it.
    const ratioIO = new IntersectionObserver(
      ([entry]) => {
        if (!desktop.matches) arm(entry.intersectionRatio);
      },
      { threshold: [0, PAUSE_BELOW, PLAY_AT, 1] },
    );
    ratioIO.observe(frame);

    // Anywhere: pause when scrolled away, and start buffering as it comes near.
    const stageIO = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) v.preload = "auto";
        update();
      },
      { threshold: 0.15 },
    );
    stageIO.observe(stage);

    // If sound was blocked, the visitor's next interaction unlocks it (unless they muted it).
    const unlock = (e: Event) => {
      if (!soundBlockedRef.current || userMuted.current) return;
      if (e.target instanceof Node && controlsRef.current?.contains(e.target)) return; // the buttons handle themselves
      setBlocked(false);
      if (!v.paused) v.muted = false;
    };
    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);

    setPlaying(!v.paused);
    setMuted(v.muted);
    return () => {
      reportProgress.current = () => {};
      ratioIO.disconnect();
      stageIO.disconnect();
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const unmute = v.muted;
    v.muted = !unmute;
    userMuted.current = !unmute;
    soundBlockedRef.current = false;
    setSoundBlocked(false);
    if (unmute && v.paused) {
      userPaused.current = false;
      userPlayed.current = true;
      v.play().catch(() => {});
    }
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      userPlayed.current = true;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      userPlayed.current = false;
      v.pause();
    }
  }, []);

  return (
    <div ref={trackRef} className="hv-track relative">
      <div ref={stageRef} className="hv-stage">
        <div className="container-x pb-14 lg:contents">
          <div ref={frameRef} className="hv-frame">
            <div ref={mediaRef} className="hv-media">
              {hasVideo ? (
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  poster={video.poster}
                  muted
                  loop
                  playsInline
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
                  aria-label={muted ? (soundBlocked ? "Turn sound on" : "Unmute video") : "Mute video"}
                  aria-pressed={!muted}
                  className={`inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-medium tracking-wide uppercase backdrop-blur-sm transition-colors hover:border-lime hover:text-lime ${
                    soundBlocked ? "hv-sound-hint border-lime bg-black/70 text-lime" : "border-white/25 bg-black/55 text-white"
                  }`}
                >
                  {muted ? <PiSpeakerSlashFill aria-hidden="true" className="size-4" /> : <PiSpeakerHighFill aria-hidden="true" className="size-4" />}
                  <span>{muted ? (soundBlocked ? "Tap for sound" : "Sound off") : "Sound on"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
