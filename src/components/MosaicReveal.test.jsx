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

  it("renders a default 4x4 grid", () => {
    const { container } = render(<MosaicReveal imageSrc={mockImageSrc} />);
    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(16);
  });

  it("handles a negative filledSquares value", () => {
    const { container } = render(
      <MosaicReveal imageSrc={mockImageSrc} filledSquares={-5} gridSize={4} />, 
    );
    const revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(0);
  });

  it("caps revealed squares at the total number of grid cells when the completion goal is higher than the total grid size", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={20}
        completionGoal={100}
        gridSize={4}
      />,
    );
    const revealedSquares = container.querySelectorAll('[style*="opacity: 1"]');
    expect(revealedSquares).toHaveLength(16);
  });

  it("renders the full image when filledSquares reaches the completionGoal", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={12}
        completionGoal={12}
        gridSize={4}
      />,
    );

    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(0);

    const fullImage = container.querySelector(
      ".w-full.rounded-lg.bg-cover.bg-center",
    );
    expect(fullImage).toBeInTheDocument();
    expect(fullImage).toHaveStyle({
      backgroundImage: `url(${mockImageSrc})`,
      aspectRatio: "1/1",
    });

    const goalBadge = container.querySelector(".bg-blue-600\\/90");
    expect(goalBadge).toHaveTextContent("Goal reached!");
  });

  it("does not render the full image before reaching the completionGoal", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={11}
        completionGoal={12}
        gridSize={4}
      />,
    );

    const squares = container.querySelectorAll(".bg-gray-800");
    expect(squares).toHaveLength(16);

    const fullImage = container.querySelector(
      ".w-full.rounded-lg.bg-cover.bg-center",
    );
    expect(fullImage).not.toBeInTheDocument();
  });

  it("shows progress text based on the completionGoal", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={5}
        completionGoal={12}
        gridSize={4}
      />,
    );

    const progressIndicator = container.querySelector(".bg-black\\/70");
    expect(progressIndicator).toHaveTextContent("5/12");
  });

  it("calls onComplete when the completionGoal is reached", () => {
    render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={12}
        completionGoal={12}
        onComplete={mockOnComplete}
        gridSize={4}
      />,
    );

    vi.runAllTimers();
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it("does not call onComplete before reaching the completionGoal", () => {
    render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={11}
        completionGoal={12}
        onComplete={mockOnComplete}
        gridSize={4}
      />,
    );

    vi.runAllTimers();
    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it("does not throw if onComplete is not provided", () => {
    const { container } = render(
      <MosaicReveal
        imageSrc={mockImageSrc}
        filledSquares={12}
        completionGoal={12}
        gridSize={4}
      />,
    );

    vi.runAllTimers();
    expect(container).toBeInTheDocument();
  });
});
