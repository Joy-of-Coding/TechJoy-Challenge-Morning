/* eslint-env vitest */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import HabitTracker from "./HabitTracker";

const defaultProps = {
  entries: [],
  setEntries: vi.fn(),
  title: "Test Hive",
  imageSrc: "",
  entryLabel: "How many hours did you log?",
  placeholder: "e.g. 2.5",
  unit: "h",
  mosaicGridSize: 4,
  gridStorageKey: "habit-hive-test-grid-size",
  inspoQuote: "Test quote",
  clearWarning: "Clear?",
};

describe("HabitTracker", () => {
  beforeEach(() => {
    defaultProps.setEntries.mockClear();
    window.localStorage.clear();
  });

  it("prompts the user for a starting number of blocks", () => {
    render(<HabitTracker {...defaultProps} />);

    expect(screen.getByText(/Choose Your Starting Hive/i)).toBeInTheDocument();
    const blockButtons = screen.getAllByRole("button", { name: /4 Blocks/i });
    fireEvent.click(blockButtons[0]);

    expect(screen.queryByText(/Choose Your Starting Hive/i)).not.toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(defaultProps.gridStorageKey))).toBe(4);
  });

  it("renders the tracker form and status", () => {
    render(<HabitTracker {...defaultProps} />);

    expect(screen.getByText(/Test quote/i)).toBeInTheDocument();
    expect(screen.getByText(/Ready to log your progress/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add to Hive/i })).toBeInTheDocument();
  });

  it("calls setEntries with a new entry when submitted", () => {
    render(<HabitTracker {...defaultProps} />);

    const input = screen.getByLabelText(/How many hours did you log/i);
    const button = screen.getByRole("button", { name: /Add to Hive/i });

    fireEvent.change(input, { target: { value: "1.5" } });
    fireEvent.click(button);

    expect(defaultProps.setEntries).toHaveBeenCalledTimes(1);
    const [newEntries] = defaultProps.setEntries.mock.calls[0];
    expect(Array.isArray(newEntries)).toBe(true);
    expect(newEntries[0]).toMatchObject({ value: 1.5 });
    expect(newEntries[0].id).toBeTruthy();
    expect(newEntries[0].date).toBeTruthy();
  });
});
