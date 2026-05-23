import React, { useState, useEffect } from "react";
import beehive from "../assets/beehive.png"; // Adjust the path as necessary

const MosaicReveal = ({
  imageSrc,
  filledSquares = 0,
  onComplete,
  gridSize = 4,
}) => {
  const [revealedSquares, setRevealedSquares] = useState([]);
  const totalSquares = gridSize * gridSize;
  const showFullImage = filledSquares >= totalSquares;

  useEffect(() => {
    // Update revealed squares based on filledSquares prop
    const newRevealedSquares = [];
    for (let i = 0; i < Math.min(filledSquares, totalSquares); i++) {
      newRevealedSquares.push(i);
    }
    setRevealedSquares(newRevealedSquares);

    // Call onComplete when all squares are filled
    if (filledSquares >= totalSquares && onComplete) {
      setTimeout(onComplete);
    }
  }, [filledSquares, totalSquares, onComplete]);

  const getSquareStyle = (index) => {
    const isRevealed = revealedSquares.includes(index);

    if (isRevealed) {
      // Calculate the position of this square in the image
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const sizePercent = 100 / gridSize;

      return {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: `${gridSize * 100}%`,
        backgroundPosition: `${col * sizePercent}% ${row * sizePercent}%`,
        backgroundRepeat: "no-repeat",
        opacity: 1,
        transition: "opacity 0.3s ease-in-out, filter 0.3s ease-in-out",
        width: "100%",
        height: "100%",
        minHeight: "40px",
        filter: "blur(3px)", // Add blur to revealed squares
      };
    }

    return {
      opacity: 0.3,
      transition: "opacity 0.3s ease-in-out, filter 0.3s ease-in-out",
      width: "100%",
      height: "100%",
      minHeight: "40px", // Ensure minimum size for visibility
    };
  };

  // If showing full image, render the complete unblurred image
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
      {/* Background image (full image) */}
      <div
        className="absolute inset-0 bg-cover bg-center rounded-lg"
        style={{
          backgroundImage: `url(${beehive})`,
          filter: "blur(4px) brightness(0.3)",
        }}
      />

      {/* Mosaic grid */}
      <div
        className="relative grid gap-1 rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          aspectRatio: "1/1",
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

      {/* Progress indicator */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {filledSquares}/{totalSquares}
      </div>
      {/* Completion count indicator */}
      {filledSquares === totalSquares && (
        <div className="absolute top-2 right-2 bg-blue-600/90 text-white px-2 py-1 rounded text-xs">
          {filledSquares}/16
        </div>
      )}
    </div>
  );
};

export default MosaicReveal;
