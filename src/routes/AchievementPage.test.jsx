import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AchievementPage from "./AchievementPage";

// Mock chart.js components
vi.mock("react-chartjs-2", () => ({
  Bar: ({ data }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>,
  Line: ({ data }) => (
    <div data-testid="line-chart">{JSON.stringify(data)}</div>
  ),
}));

describe("AchievementPage", () => {
  const mockEntries = [
    { hours: 2, date: "2024-01-01", time: "10:00" },
    { hours: 3, date: "2024-01-02", time: "14:00" },
    { hours: 1.5, date: "2024-01-03", time: "16:00" },
  ];

  it("renders achievement page with correct title", () => {
    render(<AchievementPage entries={mockEntries} />);
    expect(screen.getByText("🏆 Achievement Center")).toBeInTheDocument();
  });

  it("displays timeframe selector buttons", () => {
    render(<AchievementPage entries={mockEntries} />);
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
  });

  it("shows stats cards with correct data", () => {
    render(<AchievementPage entries={mockEntries} />);
    expect(screen.getByText("6.5")).toBeInTheDocument(); // Total hours
    expect(screen.getByText("3")).toBeInTheDocument(); // Total sessions
    expect(screen.getByText("2.2")).toBeInTheDocument(); // Average hours
  });

  it("displays progress bars", () => {
    render(<AchievementPage entries={mockEntries} />);
    expect(screen.getByText("Hours Progress")).toBeInTheDocument();
    expect(screen.getByText("Sessions Progress")).toBeInTheDocument();
  });

  it("shows achievements section", () => {
    render(<AchievementPage entries={mockEntries} />);
    expect(screen.getByText("🏆 Achievements")).toBeInTheDocument();
  });

  it("displays motivation section", () => {
    render(<AchievementPage entries={mockEntries} />);
    expect(screen.getByText("💪 Keep Going!")).toBeInTheDocument();
  });

  it("handles empty entries gracefully", () => {
    render(<AchievementPage entries={[]} />);
    expect(screen.getByText("0")).toBeInTheDocument(); // Total hours
    expect(screen.getByText("0")).toBeInTheDocument(); // Total sessions
  });

  it("shows charts when data is available", () => {
    render(<AchievementPage entries={mockEntries} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
