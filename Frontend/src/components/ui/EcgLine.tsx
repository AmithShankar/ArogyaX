"use client";

import { cn } from "@/lib/utils";
import { EcgLineProps } from "@/types";
import { useEffect, useRef } from "react";

/**
 * Canvas-based cardiac-monitor ECG trace.
 * Generates a truly continuous, randomised P/QRS/T waveform - each beat has
 * a fresh amplitude and RR-interval so the pattern never looks like a loop.
 */
export function EcgLine({ className, speed = 80 }: EcgLineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ─── sizing ──────────────────────────────────────────────────────────────
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ctx = canvas.getContext("2d")!;
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas) {
      ro.observe(canvas);
    }

    // ─── beat state ──────────────────────────────────────────────────────────
    function nextBeat() {
      return {
        rrPx: 180 + Math.random() * 120, // Longer interval for ~60BPM feel
        amp: 0.6 + Math.random() * 0.7, // 0.60–1.30×
        wander: (Math.random() - 0.5) * 0.05,
      };
    }

    let beat = nextBeat();
    let beatSamples = 0;
    let wander = 0;
    let wanderTarget = 0;

    /** ECG waveform - t ∈ [0, 1) compressed into the start of the beat */
    function ecgSample(t: number, a: number, bw: number, h: number): number {
      // Compress the active waveform into the first 40% of the RR interval (t < 0.4)
      // This ensures 60% of the time is a restful isoelectric line.
      const s = t / 0.4;
      if (s > 1) return bw;

      // P wave
      if (s >= 0.1 && s < 0.22)
        return bw - Math.sin((Math.PI * (s - 0.1)) / 0.12) * 11 * a * h;
      // Q dip
      if (s >= 0.3 && s < 0.34) return bw + ((s - 0.3) / 0.04) * 8 * a * h;
      // R spike up
      if (s >= 0.34 && s < 0.375)
        return bw + 8 * a * h - ((s - 0.34) / 0.035) * 58 * a * h; // Sharper R
      // S dip
      if (s >= 0.375 && s < 0.415)
        return bw - 50 * a * h + ((s - 0.375) / 0.04) * 62 * a * h;
      // Return to baseline
      if (s >= 0.415 && s < 0.445)
        return bw + 12 * a * h - ((s - 0.445) / 0.03) * 12 * a * h;
      // ST segment
      if (s >= 0.445 && s < 0.485) return bw - 2.5 * a * h;
      // T wave
      if (s >= 0.485 && s < 0.75)
        return bw - Math.sin((Math.PI * (s - 0.485)) / 0.265) * 19 * a * h;

      return bw;
    }

    // ─── circular pixel buffer ───────────────────────────────────────────────
    let bufW = 0,
      bufH = 0;
    let buf: Float32Array;
    let writePos = 0;

    function ensureBuf() {
      if (!canvas) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (w === bufW && h === bufH) return;
      bufW = w;
      bufH = h;
      buf = new Float32Array(w).fill(h / 2);
      writePos = 0;
    }

    // ─── animation loop ───────────────────────────────────────────────────────
    let animId = 0;
    let lastTime = performance.now();
    let frac = 0;

    function frame(now: number) {
      animId = requestAnimationFrame(frame);

      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ensureBuf();
      const w = bufW,
        h = bufH;
      if (!w || !h) return;

      const samplesF = (dt / 1000) * speed + frac;
      const steps = Math.floor(samplesF);
      frac = samplesF - steps;

      for (let s = 0; s < steps; s++) {
        if (beatSamples >= beat.rrPx) {
          beat = nextBeat();
          beatSamples = 0;
          wanderTarget = (Math.random() - 0.5) * 0.05;
        }
        wander += (wanderTarget - wander) * 0.008;

        const t = beatSamples / beat.rrPx;
        const bw = h / 2 + wander * h;
        // Increased amplitude scale (h * 0.28)
        const y = ecgSample(t, beat.amp, bw, h * 0.28);

        buf[writePos] = y;
        writePos = (writePos + 1) % w;
        beatSamples++;
      }

      // ── draw ──────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);

      // Resolve primary color from the CSS variable (inherited from :root)
      if (!canvas) return;
      const primaryHsl = getComputedStyle(canvas)
        .getPropertyValue("--primary")
        .trim();
      const traceColor = primaryHsl ? `hsl(${primaryHsl})` : "#22d3ee";

      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // ── Helper: draw a contiguous screen-x segment without wrapping ────────
      const drawSegment = (
        fromX: number,
        toX: number,
        alpha: number,
        width: number,
      ) => {
        if (fromX > toX) return;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.strokeStyle = traceColor;
        ctx.beginPath();
        for (let x = fromX; x <= toX; x++) {
          x === fromX ? ctx.moveTo(x, buf[x]) : ctx.lineTo(x, buf[x]);
        }
        ctx.stroke();
      };

      const gapPx = 44;
      // tailStart is the oldest visible pixel; the head is just behind writePos
      const tailStart = (writePos + gapPx) % w;
      const headLen = 38;
      const headStart = (writePos - headLen + w) % w;

      // ── Tail: dimmed, thin ─────────────────────────────────────────────────
      // The buffer wraps around, so we may need two contiguous segments.
      if (tailStart <= writePos) {
        // No wrap - single segment from tailStart → writePos - 1
        drawSegment(tailStart, writePos - 1, 0.45, 1.4);
      } else {
        // Wrapped - two segments: tailStart→w-1, then 0→writePos-1
        drawSegment(tailStart, w - 1, 0.45, 1.0);
        if (writePos > 0) drawSegment(0, writePos - 1, 0.45, 1.4);
      }

      // ── Head: bright glowing tip (always contiguous since headLen ≪ w) ─────
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = 2.0;
      ctx.shadowBlur = 7;
      ctx.shadowColor = traceColor;
      ctx.strokeStyle = traceColor;
      ctx.beginPath();
      for (let i = 0; i < headLen; i++) {
        const x = (headStart + i) % w;
        i === 0 ? ctx.moveTo(x, buf[x]) : ctx.lineTo(x, buf[x]);
      }
      ctx.stroke();

      // Reset state
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    }

    animId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("text-primary", className)}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
