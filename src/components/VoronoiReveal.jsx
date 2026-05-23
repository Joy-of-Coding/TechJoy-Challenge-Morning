import React from "react";
import { Delaunay } from "d3-delaunay";
import beehive from "../assets/beehive.png";

const SIZE = 300;

// Seeded random number generator (mulberry32)
const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const jitteredPoints = (n, w, h, rand) => {
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const cw = w / cols;
  const ch = h / rows;
  const pts = [];
  for (let r = 0; r < rows && pts.length < n; r++) {
    for (let c = 0; c < cols && pts.length < n; c++) {
      pts.push([(c + 0.2 + rand() * 0.6) * cw, (r + 0.2 + rand() * 0.6) * ch]);
    }
  }
  return pts;
};

const shuffle = (arr, rand) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const toPointsStr = (polygon) =>
  polygon.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

const VoronoiReveal = ({ imageSrc, filledSquares = 0, goal = 8 }) => {
  const cells = React.useMemo(() => {
    const rand = mulberry32(goal * 1337 + 42);
    const points = jitteredPoints(goal, SIZE, SIZE, rand);
    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, SIZE, SIZE]);

    const polygons = Array.from({ length: goal }, (_, i) => voronoi.cellPolygon(i))
      .filter(Boolean)
      .map((p, i) => ({ id: i, pointsStr: toPointsStr(p) }));

    // Shuffle reveal order so it looks organic, not top-to-bottom
    return shuffle(polygons, mulberry32(goal * 7919 + 13));
  }, [goal]);

  if (filledSquares >= goal) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div
          className="w-full rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})`, aspectRatio: "1/1" }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: "1/1" }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ display: "block" }}
      >
        <defs>
          {/* Background: blur + darken */}
          <filter id={`vr-bg-${goal}`}>
            <feGaussianBlur stdDeviation="4" result="blurred" />
            <feColorMatrix in="blurred" type="matrix"
              values="0.3 0 0 0 0  0 0.3 0 0 0  0 0 0.3 0 0  0 0 0 1 0" />
          </filter>
          {/* Revealed pieces: blur only */}
          <filter id={`vr-rev-${goal}`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          {cells.map(cell => (
            <clipPath key={cell.id} id={`vr-${goal}-${cell.id}`}>
              <polygon points={cell.pointsStr} />
            </clipPath>
          ))}
        </defs>

        {/* Blurry darkened beehive background */}
        <image href={beehive} x={0} y={0} width={SIZE} height={SIZE}
          filter={`url(#vr-bg-${goal})`} />

        {/* Semi-transparent overlay on unrevealed cells */}
        {cells.map((cell, i) => i >= filledSquares && (
          <polygon key={`u-${cell.id}`} points={cell.pointsStr} fill="rgba(17,24,39,0.65)" />
        ))}

        {/* Revealed cells: clip group first, then blur image inside */}
        {cells.slice(0, filledSquares).map(cell => (
          <g key={cell.id} clipPath={`url(#vr-${goal}-${cell.id})`}>
            <image href={imageSrc} x={0} y={0} width={SIZE} height={SIZE}
              filter={`url(#vr-rev-${goal})`} />
          </g>
        ))}

        {/* Cell borders */}
        {cells.map(cell => (
          <polygon key={cell.id} points={cell.pointsStr} fill="none"
            stroke="#ca8a04" strokeWidth="1" opacity="0.5" />
        ))}

        <rect x={SIZE - 64} y={SIZE - 28} width={60} height={22} rx={3} fill="rgba(0,0,0,0.75)" />
        <text x={SIZE - 34} y={SIZE - 13} textAnchor="middle" fill="white" fontSize="11" fontFamily="monospace">
          {filledSquares}/{goal}
        </text>
      </svg>
    </div>
  );
};

export default VoronoiReveal;
