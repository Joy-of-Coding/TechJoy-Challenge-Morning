import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import AchievementPage from "./AchievementPage";

// Mock chart.js components
vi.mock("react-chartjs-2", () => ({
  Bar: ({ data }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
  Line: ({ data }) => (
    <div data-testid="line-chart">{JSON.stringify(data)}</div>
  ),
}));

describe("AchievementPage", () => {
  const codingEntries = [
    { value: 2, date: "Thu May 21 2026", time: "10:00" },
    { value: 1.5, date: "Mon May 18 2026", time: "14:00" },
    { value: 4, date: "Mon May 11 2026", time: "16:00" },
  ];
  const physicalEntries = [
    { value: 1, date: "Fri May 22 2026", time: "08:00" },
    { value: 2, date: "Wed May 20 2026", time: "11:00" },
  ];
  const mentalEntries = [
    { value: 0.5, date: "Fri May 22 2026", time: "20:00" },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-22T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderPage = () =>
    render(
      <AchievementPage
        entries={codingEntries}
        physicalEntries={physicalEntries}
        mentalEntries={mentalEntries}
      />,
    );

  it("renders achievement page with correct title", () => {
    renderPage();
    expect(screen.getByText("🏆 Achievement Center")).toBeInTheDocument();
  });

  it("displays timeframe selector buttons", () => {
    renderPage();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("calculates coding weekly stats correctly", () => {
    renderPage();

    expect(screen.getByText("3.5 / 40 hours")).toBeInTheDocument();
    expect(screen.getByText("2 / 7 sessions")).toBeInTheDocument();
    expect(screen.getByText("1.8")).toBeInTheDocument();
  });

  it("calculates physical category stats correctly", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /physical/i }));

    expect(screen.getByText("Duration Progress")).toBeInTheDocument();
    expect(screen.getByText("3 / 40 hours")).toBeInTheDocument();
    expect(screen.getByText("2 / 7 activities")).toBeInTheDocument();
    expect(screen.getByText("1.5")).toBeInTheDocument();
  });

  it("calculates mental category stats correctly", () => {
    renderPage();

    fireEvent.click(screen.getByRole("button", { name: /mental/i }));

    expect(screen.getByText("Duration Progress")).toBeInTheDocument();
    expect(screen.getByText("0.5 / 40 hours")).toBeInTheDocument();
    expect(screen.getByText("1 / 7 activities")).toBeInTheDocument();
    const avgLabel = screen.getByText("Avg Duration/Activity");
    expect(avgLabel.previousElementSibling).toHaveTextContent("0.5");
  });

  it("updates calculations when timeframe changes", () => {
    renderPage();

    // For coding: month includes the older May 11 entry as well.
    fireEvent.click(screen.getByRole("button", { name: /month/i }));
    expect(screen.getByText("7.5 / 160 hours")).toBeInTheDocument();
    expect(screen.getByText("3 / 30 sessions")).toBeInTheDocument();
  });

  it("handles empty entries gracefully", () => {
    render(
      <AchievementPage entries={[]} physicalEntries={[]} mentalEntries={[]} />,
    );

    expect(screen.getByText("0 / 40 hours")).toBeInTheDocument();
    expect(screen.getByText("0 / 7 sessions")).toBeInTheDocument();
  });

  it("shows charts and core sections", () => {
    renderPage();

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByText("🏆 Achievements")).toBeInTheDocument();
    expect(screen.getByText("💪 Keep Going!")).toBeInTheDocument();
  });
});
