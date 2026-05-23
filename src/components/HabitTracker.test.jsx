import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { DEFAULT_SESSION_GOALS } from "../utils/habitConfig";

const { mosaicRevealSpy } = vi.hoisted(() => ({
  mosaicRevealSpy: vi.fn(),
}));

vi.mock("./MosaicReveal", () => ({
  default: (props) => {
    mosaicRevealSpy(props);
    return <div data-testid="mosaic-reveal" />;
  },
}));

import HabitTracker from "./HabitTracker";

const defaultProps = {
  entries: [],
  setEntries: vi.fn(),
  title: "Your Coding Hive",
  imageSrc: "test-image.jpg",
  entryLabel: "How many hours did you code?",
  placeholder: "e.g. 2.5",
  unit: "h",
  habitKey: "coding",
  inspoQuote: "You have got this!",
};

const makeTodayEntry = (value = 1) => ({
  value,
  time: "10:00 AM",
  date: new Date().toDateString(),
});

describe("HabitTracker weekly goal cap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("uses weekly session progress for the popup mosaic", () => {
    const today = new Date();
    const oldEntryDate = new Date();
    oldEntryDate.setDate(today.getDate() - 14);

    render(
      <HabitTracker
        {...defaultProps}
        entries={[
          { ...makeTodayEntry(2), date: oldEntryDate.toDateString() },
          makeTodayEntry(1),
        ]}
      />,
    );

    fireEvent.change(screen.getByLabelText(/how many hours did you code/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add to hive/i }));

    const latestCall = mosaicRevealSpy.mock.calls.at(-1)?.[0];

    expect(screen.getByTestId("mosaic-reveal")).toBeInTheDocument();
    expect(latestCall?.filledSquares).toBe(1);
  });

  it("resets only the current habit goal when habit data is cleared", () => {
    window.localStorage.setItem(
      "habit-hive-session-goals",
      JSON.stringify({ coding: 6, physical: 8, mental: 10 }),
    );

    const setEntries = vi.fn();
    render(
      <HabitTracker
        {...defaultProps}
        setEntries={setEntries}
        entries={[makeTodayEntry()]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /clear data/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(setEntries).toHaveBeenCalledWith([]);
    expect(
      JSON.parse(window.localStorage.getItem("habit-hive-session-goals")),
    ).toEqual({
      coding: DEFAULT_SESSION_GOALS.coding,
      physical: 8,
      mental: 10,
    });
  });

  it("blocks logging when weekly goal is already met and shows prompt", () => {
    window.localStorage.setItem(
      "habit-hive-session-goals",
      JSON.stringify({ coding: 2, physical: 16, mental: 16 }),
    );

    const setEntries = vi.fn();
    render(
      <HabitTracker
        {...defaultProps}
        setEntries={setEntries}
        entries={[makeTodayEntry(), makeTodayEntry()]}
      />,
    );

    fireEvent.change(screen.getByLabelText(/how many hours did you code/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add to hive/i }));

    expect(setEntries).not.toHaveBeenCalled();
    expect(
      screen.getByText(/congratulations! you met your weekly goal/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /yes, increase goal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /no, keep goal/i }),
    ).toBeInTheDocument();
  });

  it("allows increasing goal and then permits another session", () => {
    window.localStorage.setItem(
      "habit-hive-session-goals",
      JSON.stringify({ coding: 2, physical: 16, mental: 16 }),
    );

    const setEntries = vi.fn();
    render(
      <HabitTracker
        {...defaultProps}
        setEntries={setEntries}
        entries={[makeTodayEntry(), makeTodayEntry()]}
      />,
    );

    fireEvent.change(screen.getByLabelText(/how many hours did you code/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add to hive/i }));

    fireEvent.click(
      screen.getByRole("button", { name: /yes, increase goal/i }),
    );
    fireEvent.change(screen.getByLabelText(/new weekly goal/i), {
      target: { value: "3" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /update weekly goal/i }),
    );

    expect(
      screen.getByText(/weekly goal increased to 3 sessions/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /add to hive/i }));

    expect(setEntries).toHaveBeenCalledTimes(1);
    expect(setEntries.mock.calls[0][0]).toHaveLength(3);
  });

  it("shows validation when new goal is not greater than current", () => {
    window.localStorage.setItem(
      "habit-hive-session-goals",
      JSON.stringify({ coding: 2, physical: 16, mental: 16 }),
    );

    render(
      <HabitTracker
        {...defaultProps}
        entries={[makeTodayEntry(), makeTodayEntry()]}
      />,
    );

    fireEvent.change(screen.getByLabelText(/how many hours did you code/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add to hive/i }));

    fireEvent.click(
      screen.getByRole("button", { name: /yes, increase goal/i }),
    );
    fireEvent.change(screen.getByLabelText(/new weekly goal/i), {
      target: { value: "2" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /update weekly goal/i }),
    );

    expect(
      screen.getByText(/must be greater than your current goal/i),
    ).toBeInTheDocument();
  });

  it("shows validation when new goal is above weekly max", () => {
    window.localStorage.setItem(
      "habit-hive-session-goals",
      JSON.stringify({ coding: 15, physical: 16, mental: 16 }),
    );

    render(
      <HabitTracker
        {...defaultProps}
        entries={Array.from({ length: 15 }, () => makeTodayEntry())}
      />,
    );

    fireEvent.change(screen.getByLabelText(/how many hours did you code/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add to hive/i }));

    fireEvent.click(
      screen.getByRole("button", { name: /yes, increase goal/i }),
    );
    fireEvent.change(screen.getByLabelText(/new weekly goal/i), {
      target: { value: "17" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /update weekly goal/i }),
    );

    expect(
      screen.getByText(/cannot be more than 16 sessions/i),
    ).toBeInTheDocument();
  });
});
