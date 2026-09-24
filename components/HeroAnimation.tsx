"use client";

import { useState, useEffect } from "react";

const ALL_IMAGES = [
  { src: "/hero_portrait.jpg",   label: "Portrait",   tag: "Cinematic" },
  { src: "/hero_cyberpunk.jpg",  label: "Cyberpunk",  tag: "Sci-Fi" },
  { src: "/hero_fantasy.jpg",    label: "Fantasy",    tag: "Magic" },
  { src: "/hero_warrior.jpg",    label: "Warrior",    tag: "Epic" },
  { src: "/hero_zen.jpg",        label: "Zen",        tag: "Peaceful" },
  { src: "/hero_anime.jpg",      label: "Anime",      tag: "Ghibli" },
  { src: "/hero_steampunk.jpg",  label: "Steampunk",  tag: "Victorian" },
];

// Each cell gets a different starting image and cycles independently
const CELLS = [
  { startIdx: 0, delay: 0,    tall: true  },  // top-left large
  { startIdx: 2, delay: 1400, tall: false },  // top-right top
  { startIdx: 4, delay: 2800, tall: false },  // top-right bottom
  { startIdx: 1, delay: 700,  tall: false },  // bottom-left
  { startIdx: 3, delay: 2100, tall: true  },  // bottom-right large
  { startIdx: 6, delay: 3500, tall: false },  // bottom-center
];

function MosaicCell({ startIdx, delay, height }: { startIdx: number; delay: number; height: string }) {
  const [current, setCurrent] = useState(startIdx % ALL_IMAGES.length);
  const [next, setNext] = useState((startIdx + 1) % ALL_IMAGES.length);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setTransitioning(true);
        setTimeout(() => {
          setCurrent(c => {
            const n = (c + 1) % ALL_IMAGES.length;
            setNext((n + 1) % ALL_IMAGES.length);
            return n;
          });
          setTransitioning(false);
        }, 700);
      }, 5500 + delay * 0.3);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const img = ALL_IMAGES[current];
  const nextImg = ALL_IMAGES[next];

  return (
    <div style={{
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      width: "100%",
      height: height,
      background: "#0a1929",
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    }}>
      {/* Current image */}
      <img src={img.src} alt={img.label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: transitioning ? 0 : 1, transition: "opacity 0.7s ease" }}
      />
      {/* Next image pre-loaded underneath */}
      <img src={nextImg.src} alt={nextImg.label}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }}
      />
      {/* Shimmer during transition */}
      {transitioning && (
        <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "linear-gradient(135deg, rgba(13,110,253,0.15), rgba(255,255,255,0.08))", animation: "heroShimmer 0.7s ease" }} />
      )}
    </div>
  );
}

export default function HeroAnimation() {
  return (
    <div style={{ width: "100%", height: 340, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "165px 165px", gap: 8 }}>

      {/* Col 1: tall single cell spanning both rows */}
      <div style={{ gridColumn: "1", gridRow: "1 / 3", minHeight: 0 }}>
        <MosaicCell startIdx={0} delay={0} height="100%" />
      </div>

      {/* Col 2 Row 1 */}
      <div style={{ gridColumn: "2", gridRow: "1", minHeight: 0 }}>
        <MosaicCell startIdx={2} delay={1400} height="100%" />
      </div>

      {/* Col 2 Row 2 */}
      <div style={{ gridColumn: "2", gridRow: "2", minHeight: 0 }}>
        <MosaicCell startIdx={5} delay={3500} height="100%" />
      </div>

      {/* Col 3 Row 1 */}
      <div style={{ gridColumn: "3", gridRow: "1", minHeight: 0 }}>
        <MosaicCell startIdx={4} delay={2100} height="100%" />
      </div>

      {/* Col 3 Row 2 */}
      <div style={{ gridColumn: "3", gridRow: "2", minHeight: 0 }}>
        <MosaicCell startIdx={6} delay={700} height="100%" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes heroShimmer { 0%{opacity:0} 50%{opacity:1} 100%{opacity:0} }
      `}} />
    </div>
  );
}


