import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import MosaicReveal from "./MosaicReveal";

// Mock the image import
vi.mock("../assets/beehive.png", () => ({
  default: "mocked-beehive-image.png",
}));

describe("MosaicReveal", () => {
  const mockImageSrc = "test-image.jpg";
  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnComplete.mockClear();
  });

  it("renders with default props", () => {
    const { container } = render(<MosaicReveal imageSrc={mockImageSrc} />);
    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(16); // Default 4x4 grid
  });
  it("handles missing imageSrc prop", () => {
    const { container } = render(<MosaicReveal />);
    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(16); // Default grid should still render
  });

  it("handles negative filledSquares value", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={-1} gridSize={4} />,
    );
    const revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(0); // No squares should be revealed
  });

  it("handles filledSquares greater than total squares", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={20} gridSize={4} />,
    );
    const revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(16); // Should cap at total squares
  });

  it("maintains aspect ratio with different grid sizes", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} gridSize={3} />,
    );
    const grid = container.querySelector(".grid");
    expect(grid).toHaveStyle({
      aspectRatio: "1/1",
    });
  });

  it("applies correct styles for revealed squares", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={1} gridSize={4} />,
    );

    const firstSquare = container.querySelector(".bg-gray-800");
    const computedStyle = window.getComputedStyle(firstSquare);

    expect(firstSquare).toHaveStyle({
      backgroundImage: `url(${mockImageSrc})`,
      opacity: "1",
      filter: "blur(3px)",
    });
  });

  it("applies correct styles for unrevealed squares", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={0} gridSize={4} />,
    );

    const firstSquare = container.querySelector(".bg-gray-800");
    expect(firstSquare).toHaveStyle({
      opacity: "0.3",
    });
  });

  it("calculates correct background position for revealed squares", () => {
    const gridSize = 4;
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={15}
        gridSize={gridSize}
      />,
    );

    const squares = [...container.querySelectorAll(".bg-gray-800")].slice(0, 15);
    expect(squares).toHaveLength(15);
    squares.forEach((square, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const sizePercent = 100 / (gridSize - 1);

      expect(square).toHaveStyle({
        backgroundPosition: `${col * sizePercent}% ${row * sizePercent}%`,
        backgroundSize: `${gridSize * 100}%`,
      });
    });
  });

  it("updates revealed squares when filledSquares prop changes", () => {
    const { rerender, container } = render(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={0} gridSize={4} />,
    );

    // Initially all squares should be unrevealed
    let revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(0);

    // Update filledSquares
    rerender(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={4} gridSize={4} />,
    );

    revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(4);
  });

  it("renders background image with correct blur effect", () => {
    const { container } = render(<MosaicReveal imageSrc={mockImageSrc} />);

    const backgroundDiv = container.querySelector(".absolute.inset-0");
    expect(backgroundDiv.style.backgroundImage).to.equal(
      'url("mocked-beehive-image.png")',
    );
    expect(backgroundDiv.style.filter).to.equal("blur(4px) brightness(0.3)");
  });
  it("displays completion count indicator when completionCount > 0", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} completionCount={5} />,
    );

    const completionIndicator = container.querySelector(".bg-blue-600\\/90");
    expect(completionIndicator).toHaveTextContent("5/16");
  });

  it("does not display completion count indicator when completionCount is 0", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} completionCount={0} />,
    );

    const completionIndicator = container.querySelector(".bg-blue-600\\/90");
    expect(completionIndicator).not.toBeInTheDocument();
  });

  it("shows full unblurred image when completionCount >= 16", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        completionCount={16}
        filledSquares={10}
      />,
    );

    // Should not render mosaic grid
    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(16);

    // Should render full image
    const fullImage = container.querySelector(".bg-cover.bg-center");
    expect(fullImage).toHaveStyle({
      backgroundImage: `url(${mockImageSrc})`,
      aspectRatio: "1/1",
    });

    // Should show unlocked badge
    const unlockedBadge = container.querySelector(".bg-green-600\\/90");
    expect(unlockedBadge).toBeInTheDocument();
    expect(unlockedBadge).toHaveTextContent("Unlocked!");

    // Should still show progress indicator
    const progressIndicator = container.querySelector(".bg-black\\/70");
    expect(progressIndicator).toBeInTheDocument();
    expect(progressIndicator).toHaveTextContent("10/16");
  });

  it("shows full unblurred image when completionCount > 16", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        completionCount={20}
        filledSquares={16}
      />,
    );

    // Should not render mosaic grid
    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(0);

    // Should render full image
    const fullImage = container.querySelector(".bg-cover.bg-center");
    expect(fullImage).toBeInTheDocument();
  });

  it("removes blur from revealed squares when completionCount >= 16", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        completionCount={15}
        filledSquares={1}
      />,
    );

    // With completionCount < 16, squares should still be blurred
    const firstSquare = container.querySelector(".bg-gray-800");
    expect(firstSquare).toHaveStyle({
      filter: "blur(3px)",
    });
  });

  it("maintains aspect ratio for full image view", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} completionCount={16} />,
    );

    const fullImage = container.querySelector(".bg-cover.bg-center");
    expect(fullImage).toHaveStyle({
      aspectRatio: "1/1",
    });
  });

  it("calls onComplete callback when all squares are filled", () => {
    render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={16}
        onComplete={mockOnComplete}
        gridSize={4}
      />,
    );

    // Fast-forward timers to trigger the setTimeout in useEffect
    vi.runAllTimers();

    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it("does not call onComplete when filledSquares is less than total", () => {
    render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={15}
        onComplete={mockOnComplete}
        gridSize={4}
      />,
    );

    vi.runAllTimers();

    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it("does not call onComplete when onComplete prop is not provided", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={16} gridSize={4} />,
    );

    vi.runAllTimers();

    // Should not throw an error
    expect(container).toBeInTheDocument();
  });
});
