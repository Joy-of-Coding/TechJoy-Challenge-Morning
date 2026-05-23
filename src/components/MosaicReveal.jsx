import React, { useState, useEffect } from "react";
import beehive from "../assets/beehive.png";

const MosaicReveal = ({
  imageSrc,
  filledSquares = 0,
  onComplete,
  gridSize = 4,
}) => {
  const [revealedSquares, setRevealedSquares] = useState([]);
  const totalSquares = gridSize;
  const columns = Math.ceil(Math.sqrt(totalSquares));
  const rows = Math.ceil(totalSquares / columns);
  const showFullImage = filledSquares >= totalSquares;

  useEffect(() => {
    const newRevealedSquares = [];
    for (let i = 0; i < Math.min(filledSquares, totalSquares); i++) {
      newRevealedSquares.push(i);
    }
    setRevealedSquares(newRevealedSquares);

    if (filledSquares >= totalSquares && onComplete) {
      setTimeout(onComplete, 0);
    }
  }, [filledSquares, totalSquares, onComplete]);

  const getSquareStyle = (index) => {
    const isRevealed = revealedSquares.includes(index);

    if (isRevealed) {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const sizePercentX = 100 / columns;
      const sizePercentY = 100 / rows;

      return {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${columns * 100}% ${rows * 100}%`,
        backgroundPosition: `${col * sizePercentX}% ${row * sizePercentY}%`,
        backgroundRepeat: "no-repeat",
        opacity: 1,
        transition: "opacity 0.3s ease-in-out, filter 0.3s ease-in-out",
        width: "100%",
        height: "100%",
        minHeight: "40px",
        filter: "blur(3px)",
      };
    }

    return {
      opacity: 0.3,
      transition: "opacity 0.3s ease-in-out, filter 0.3s ease-in-out",
      width: "100%",
      height: "100%",
      minHeight: "40px",
    };
  };

  if (showFullImage) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div
          className="w-full rounded-lg bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageSrc})`,
            aspectRatio: "1/1",
          }}
        />
      </div>
    );
  }

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
        className="relative grid gap-1 rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          aspectRatio: `${columns} / ${rows}`,
          width: "100%",
        }}
      >
        {Array.from({ length: totalSquares }, (_, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-600 rounded-sm flex items-center justify-center"
            style={getSquareStyle(index)}
          />
        ))}
      </div>

      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {filledSquares}/{totalSquares}
      </div>
    </div>
  );
};

export default MosaicReveal;
