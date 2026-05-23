import React from "react";
import beehive from "../assets/beehive.png";

const TWO_PI = 2 * Math.PI;
const SIZE = 300;

const norm = (a) => ((a % TWO_PI) + TWO_PI) % TWO_PI;

const boundaryPoint = (cx, cy, half, theta) => {
  const dx = Math.sin(theta);
  const dy = -Math.cos(theta);
  let best = Infinity;

  const check = (t, perp) => {
    if (t > 1e-10 && Math.abs(perp) <= half + 1e-10 && t < best) best = t;
  };

  if (Math.abs(dx) > 1e-10) {
    check(half / dx, dy * (half / dx));
    check(-half / dx, dy * (-half / dx));
  }
  if (Math.abs(dy) > 1e-10) {
    check(half / dy, dx * (half / dy));
    check(-half / dy, dx * (-half / dy));
  }

  return { x: cx + dx * best, y: cy + dy * best };
};

// Corners in clockwise-from-top order with their angles and relative positions
const CORNERS = [
  { theta: Math.PI / 4,     rel: [1, -1] }, // top-right
  { theta: 3 * Math.PI / 4, rel: [1,  1] }, // bottom-right
  { theta: 5 * Math.PI / 4, rel: [-1, 1] }, // bottom-left
  { theta: 7 * Math.PI / 4, rel: [-1,-1] }, // top-left
];

const slicePolygon = (cx, cy, half, startAngle, endAngle) => {
  const span = norm(endAngle - startAngle);
  const corners = CORNERS
    .filter(c => norm(c.theta - startAngle) < span - 1e-10)
    .sort((a, b) => norm(a.theta - startAngle) - norm(b.theta - startAngle))
    .map(c => ({ x: cx + c.rel[0] * half, y: cy + c.rel[1] * half }));

  return [
    { x: cx, y: cy },
    boundaryPoint(cx, cy, half, startAngle),
    ...corners,
    boundaryPoint(cx, cy, half, endAngle),
  ];
};

const toPointsStr = (points) =>
  points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

const PizzaReveal = ({ imageSrc, filledSquares = 0, goal = 8 }) => {
  const cx = SIZE / 2, cy = SIZE / 2, half = SIZE / 2;

  const slices = React.useMemo(() => {
    const step = TWO_PI / goal;
    return Array.from({ length: goal }, (_, i) => {
      const start = norm(i * step);
      const end = norm((i + 1) * step);
      return toPointsStr(slicePolygon(cx, cy, half, start, end));
    });
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
          <filter id={`pz-bg-${goal}`}>
            <feGaussianBlur stdDeviation="4" result="blurred" />
            <feColorMatrix in="blurred" type="matrix"
              values="0.3 0 0 0 0  0 0.3 0 0 0  0 0 0.3 0 0  0 0 0 1 0" />
          </filter>
          {/* Revealed pieces: blur only */}
          <filter id={`pz-rev-${goal}`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          {slices.map((_, i) => (
            <clipPath key={i} id={`pz-${goal}-${i}`}>
              <polygon points={slices[i]} />
            </clipPath>
          ))}
        </defs>

        {/* Blurry darkened beehive background */}
        <image href={beehive} x={0} y={0} width={SIZE} height={SIZE}
          filter={`url(#pz-bg-${goal})`} />

        {/* Semi-transparent overlay on unrevealed slices */}
        {slices.map((pointsStr, i) => i >= filledSquares && (
          <polygon key={`u-${i}`} points={pointsStr} fill="rgba(17,24,39,0.65)" />
        ))}

        {/* Revealed slices: clip group first, then blur image inside */}
        {slices.slice(0, filledSquares).map((_, i) => (
          <g key={i} clipPath={`url(#pz-${goal}-${i})`}>
            <image href={imageSrc} x={0} y={0} width={SIZE} height={SIZE}
              filter={`url(#pz-rev-${goal})`} />
          </g>
        ))}

        {/* Slice borders */}
        {slices.map((pointsStr, i) => (
          <polygon key={i} points={pointsStr} fill="none"
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

export default PizzaReveal;
