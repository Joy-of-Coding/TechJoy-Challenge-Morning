import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
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
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={-1}
        totalSquares={16}
      />,
    );
    const revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(0); // No squares should be revealed
  });

  it("handles filledSquares greater than total squares", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={20}
        totalSquares={16}
      />,
    );
    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(0); // Full image mode replaces the grid

    const fullImage = container.querySelector(".bg-cover.bg-center");
    expect(fullImage).toBeInTheDocument();
  });

  it("renders correct grid columns for given totalSquares", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} totalSquares={9} />,
    );
    const grid = container.querySelector(".grid");
    expect(grid).toHaveStyle({
      gridTemplateColumns: "repeat(3, 1fr)",
    });
  });

  it("applies correct styles for revealed squares", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={1}
        totalSquares={16}
      />,
    );

    const firstSquare = container.querySelector(".bg-gray-800");
    // const computedStyle = window.getComputedStyle(firstSquare);

    expect(firstSquare).toHaveStyle({
      backgroundImage: `url(${mockImageSrc})`,
      opacity: "1",
      filter: "blur(3px)",
    });
  });

  it("applies correct styles for unrevealed squares", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={0}
        totalSquares={16}
      />,
    );

    const firstSquare = container.querySelector(".bg-gray-800");
    expect(firstSquare).toHaveStyle({
      opacity: "0.3",
    });
  });

  it("calculates correct background position for revealed squares", () => {
    const totalSquares = 16;
    const cols = 4;
    const rows = 4;
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={16}
        totalSquares={totalSquares}
      />,
    );

    const squares = container.querySelectorAll(".bg-gray-800");
    squares.forEach((square, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      expect(square).toHaveStyle({
        backgroundPosition: `${col * (100 / cols)}% ${row * (100 / rows)}%`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
      });
    });
  });

  it("updates revealed squares when filledSquares prop changes", () => {
    const { rerender, container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={0}
        totalSquares={16}
      />,
    );

    // Initially all squares should be unrevealed
    let revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(0);

    // Update filledSquares
    rerender(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={4}
        totalSquares={16}
      />,
    );

    revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(4);
  });

  it("renders background image with correct blur effect", () => {
    const { container } = render(<MosaicReveal imageSrc={mockImageSrc} />);

    const backgroundDiv = container.querySelector(".absolute.inset-0");
    expect(backgroundDiv).toHaveStyle({
      backgroundImage: 'url("mocked-beehive-image.png")',
      filter: "blur(4px) brightness(0.3)",
    });
  });

  it("does not display completion indicator when full-image mode is active", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={16}
        totalSquares={16}
      />,
    );

    const completionIndicator = container.querySelector(".bg-blue-600\\/90");
    expect(completionIndicator).not.toBeInTheDocument();
  });

  it("does not display completion count indicator before completion", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={8}
        totalSquares={16}
      />,
    );

    const completionIndicator = container.querySelector(".bg-blue-600\\/90");
    expect(completionIndicator).not.toBeInTheDocument();
  });

  it("shows full unblurred image when filledSquares >= totalSquares", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={16}
        totalSquares={16}
      />,
    );

    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(0);

    const fullImage = container.querySelector(".bg-cover.bg-center");
    expect(fullImage).toHaveStyle({
      backgroundImage: `url(${mockImageSrc})`,
      aspectRatio: "1/1",
    });
  });

  it("shows full unblurred image when filledSquares > totalSquares", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={20}
        totalSquares={16}
      />,
    );

    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(0);

    const fullImage = container.querySelector(".bg-cover.bg-center");
    expect(fullImage).toBeInTheDocument();
  });

  it("keeps blur on revealed squares while mosaic is still shown", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={1}
        totalSquares={16}
      />,
    );

    const firstSquare = container.querySelector(".bg-gray-800");
    expect(firstSquare).toHaveStyle({
      filter: "blur(3px)",
    });
  });

  it("maintains aspect ratio for full image view", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={16}
        totalSquares={16}
      />,
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
        totalSquares={16}
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
        totalSquares={16}
      />,
    );

    vi.runAllTimers();

    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it("does not call onComplete when onComplete prop is not provided", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={16}
        totalSquares={16}
      />,
    );

    vi.runAllTimers();

    // Should not throw an error
    expect(container).toBeInTheDocument();
  });
});
