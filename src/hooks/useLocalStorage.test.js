import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage Hook Tests", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    window.localStorage.getItem.mockClear();
    window.localStorage.setItem.mockClear();
    window.localStorage.removeItem.mockClear();
  });

  it("should initialize with initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", []));
    expect(result.current[0]).toEqual([]);
    expect(typeof result.current[1]).toBe("function");
  });

  it("should initialize with value from localStorage when data exists", () => {
    const storedData = [{ hours: 2.5, time: "10:30" }];
    window.localStorage.setItem("test-key", JSON.stringify(storedData));
    const { result } = renderHook(() => useLocalStorage("test-key", []));
    expect(result.current[0]).toEqual(storedData);
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", []));
    act(() => {
      result.current[1]([{ hours: 1.5, time: "14:20" }]);
    });
    expect(result.current[0]).toEqual([{ hours: 1.5, time: "14:20" }]);
    expect(JSON.parse(window.localStorage.getItem("test-key"))).toEqual([
      { hours: 1.5, time: "14:20" },
    ]);
  });

  it("should handle function updates correctly", () => {
    const initialData = [{ hours: 1.0, time: "09:00" }];
    window.localStorage.setItem("test-key", JSON.stringify(initialData));
    const { result } = renderHook(() => useLocalStorage("test-key", []));
    act(() => {
      result.current[1]((prevData) => [
        ...prevData,
        { hours: 2.0, time: "15:30" },
      ]);
    });
    const expectedData = [
      { hours: 1.0, time: "09:00" },
      { hours: 2.0, time: "15:30" },
    ];
    expect(result.current[0]).toEqual(expectedData);
    expect(JSON.parse(window.localStorage.getItem("test-key"))).toEqual(
      expectedData,
    );
  });

  it("should handle localStorage getItem errors gracefully", () => {
    window.localStorage.getItem.mockImplementationOnce(() => {
      throw new Error("localStorage not available");
    });
    const { result } = renderHook(() =>
      useLocalStorage("test-key", ["fallback"]),
    );
    expect(result.current[0]).toEqual(["fallback"]);
  });

  it("should handle localStorage setItem errors gracefully", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", []));
    window.localStorage.setItem.mockImplementationOnce(() => {
      throw new Error("localStorage write failed");
    });
    act(() => {
      result.current[1](["new-data"]);
    });
    // State still updates even if persistence fails.
    expect(result.current[0]).toEqual(["new-data"]);
  });

  it("should handle JSON parsing errors gracefully", () => {
    window.localStorage.setItem("test-key", "invalid-json");
    const { result } = renderHook(() =>
      useLocalStorage("test-key", ["fallback"]),
    );
    expect(result.current[0]).toEqual(["fallback"]);
  });

  it("should handle different data types", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    act(() => {
      result.current[1]({ name: "test", value: 123 });
    });
    expect(result.current[0]).toEqual({ name: "test", value: 123 });
  });

  it("should maintain separate state for different keys", () => {
    const { result: result1 } = renderHook(() => useLocalStorage("key1", []));
    const { result: result2 } = renderHook(() => useLocalStorage("key2", []));
    act(() => {
      result1.current[1]([1, 2, 3]);
      result2.current[1](["a", "b", "c"]);
    });
    expect(result1.current[0]).toEqual([1, 2, 3]);
    expect(result2.current[0]).toEqual(["a", "b", "c"]);
  });
});
