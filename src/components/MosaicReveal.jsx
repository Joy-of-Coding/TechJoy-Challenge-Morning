import React, { useState, useEffect } from "react";
import beehive from "../assets/beehive.png";

// Aim for ~3 tiles per row, max 4 per row, max 4 rows. Fuller rows at top.
function getRowCounts(n) {
  if (n <= 0) return [1];
  const numRows = Math.min(Math.ceil(n / 3), 4);
  const base = Math.floor(n / numRows);
  const extras = n % numRows;
  const rows = Array(numRows).fill(base);
  for (let i = 0; i < extras; i++) rows[i]++;
  return rows;
}

function getTileStyle(isRevealed, imageSrc, rowIndex, colIndex, countInRow, numRows) {
  if (!isRevealed) {
    return { opacity: 0.3, transition: "opacity 0.3s ease-in-out" };
  }
  const xPos = countInRow > 1 ? (colIndex / (countInRow - 1)) * 100 : 0;
  const yPos = numRows > 1 ? (rowIndex / (numRows - 1)) * 100 : 0;
  return {
    backgroundImage: `url(${imageSrc})`,
    backgroundSize: `${countInRow * 100}% ${numRows * 100}%`,
    backgroundPosition: `${xPos}% ${yPos}%`,
    backgroundRepeat: "no-repeat",
    opacity: 1,
    transition: "opacity 0.3s ease-in-out",
    filter: "blur(3px)",
  };
}

const MosaicReveal = ({
  imageSrc,
  filledSquares = 0,
  onComplete,
  gridSize = 4,
  goal,
}) => {
  const totalSquares = goal ?? gridSize * gridSize;
  const rowCounts = getRowCounts(totalSquares);
  const numRows = rowCounts.length;
  const showFullImage = filledSquares >= totalSquares;
  const [revealedSquares, setRevealedSquares] = useState([]);

  useEffect(() => {
    const revealed = [];
    for (let i = 0; i < Math.min(filledSquares, totalSquares); i++) {
      revealed.push(i);
    }
    setRevealedSquares(revealed);
    if (filledSquares >= totalSquares && onComplete) {
      setTimeout(onComplete);
    }
  }, [filledSquares, totalSquares, onComplete]);

  if (showFullImage) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div
          className="w-full rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${imageSrc})`, aspectRatio: "1/1" }}
        />
      </div>
    );
  }

  let tileIndex = 0;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="absolute inset-0 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(${beehive})`,
          filter: "blur(4px) brightness(0.3)",
        }}
      />
      <div
        className="mosaic-grid relative rounded-lg overflow-hidden"
        style={{
          display: "flex",
          flexDirection: "column",
          aspectRatio: "1/1",
          width: "100%",
          gap: "4px",
        }}
      >
        {rowCounts.map((count, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flex: 1, gap: "4px" }}>
            {Array.from({ length: count }, (_, colIndex) => {
              const i = tileIndex++;
              return (
                <div
                  key={i}
                  className="bg-gray-800 border border-gray-600 rounded-sm"
                  style={{
                    flex: 1,
                    ...getTileStyle(
                      revealedSquares.includes(i),
                      imageSrc,
                      rowIndex,
                      colIndex,
                      count,
                      numRows
                    ),
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {filledSquares}/{totalSquares}
      </div>
    </div>
  );
};

export default MosaicReveal;
