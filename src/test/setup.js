import "@testing-library/jest-dom";
import { vi, afterEach } from "vitest";

// Mock localStorage for testing
const localStorageMock = {
  _storage: {},
  getItem: vi.fn((key) => localStorageMock._storage[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock._storage[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock._storage[key];
  }),
  clear: vi.fn(() => {
    localStorageMock._storage = {};
  }),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock window.matchMedia for React components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});
