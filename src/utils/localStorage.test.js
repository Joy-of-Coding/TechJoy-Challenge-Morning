import {
  saveEntriesToStorage,
  loadEntriesFromStorage,
  clearEntriesFromStorage,
  resetSessionGoalsToDefault,
} from "./localStorage";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  DEFAULT_SESSION_GOALS,
  SESSION_GOALS_STORAGE_KEY,
} from "./habitConfig";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Local Storage Utils", () => {
  const category = "coding";
  const storageKey = "habit-hive-coding-entries";

  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it("saveEntriesToStorage should save entries to localStorage", () => {
    const testEntries = [{ hours: 2.5, time: "10:30" }];
    saveEntriesToStorage(testEntries, category);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(testEntries),
    );
  });

  it("saveEntriesToStorage should handle localStorage errors gracefully", () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error("localStorage not available");
    });
    expect(() => {
      saveEntriesToStorage([{ hours: 1.0, time: "10:00" }], category);
    }).not.toThrow();
  });

  it("loadEntriesFromStorage should return empty array when no data exists", () => {
    localStorageMock.getItem.mockReturnValue(null);
    const result = loadEntriesFromStorage(category);
    expect(result).toEqual([]);
  });

  it("loadEntriesFromStorage should return parsed entries when data exists", () => {
    const testEntries = [{ hours: 2.5, time: "10:30" }];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(testEntries));
    const result = loadEntriesFromStorage(category);
    expect(result).toEqual(testEntries);
  });

  it("loadEntriesFromStorage should handle JSON parsing errors gracefully", () => {
    localStorageMock.getItem.mockReturnValue("invalid-json");
    const result = loadEntriesFromStorage(category);
    expect(result).toEqual([]);
  });

  it("loadEntriesFromStorage should handle localStorage errors gracefully", () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error("localStorage not available");
    });
    const result = loadEntriesFromStorage(category);
    expect(result).toEqual([]);
  });

  it("clearEntriesFromStorage should remove entries from localStorage", () => {
    clearEntriesFromStorage(category);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith(storageKey);
  });

  it("clearEntriesFromStorage should handle localStorage errors gracefully", () => {
    localStorageMock.removeItem.mockImplementation(() => {
      throw new Error("localStorage not available");
    });
    expect(() => {
      clearEntriesFromStorage(category);
    }).not.toThrow();
  });

  it("resetSessionGoalsToDefault should restore the default session goals", () => {
    resetSessionGoalsToDefault();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      SESSION_GOALS_STORAGE_KEY,
      JSON.stringify(DEFAULT_SESSION_GOALS),
    );
  });
});
