import { useState } from "react";

// Generic hook for any localStorage key
export const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Compute from the latest state to avoid stale closures with functional updates
      setStoredValue((prevValue) => {
        const valueToStore =
          value instanceof Function ? value(prevValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Category-specific hooks for habit tracking
export const useCodingEntries = () => {
  return useLocalStorage("habit-hive-coding-entries", []);
};

export const usePhysicalEntries = () => {
  return useLocalStorage("habit-hive-physical-entries", []);
};

export const useMentalHealthEntries = () => {
  return useLocalStorage("habit-hive-mental-health-entries", []);
};

// Hook for managing all categories at once
export const useAllHabitEntries = () => {
  const [codingEntries, setCodingEntries] = useCodingEntries();
  const [physicalEntries, setPhysicalEntries] = usePhysicalEntries();
  const [mentalHealthEntries, setMentalHealthEntries] =
    useMentalHealthEntries();

  const updateEntries = (category, newEntries) => {
    switch (category) {
      case "coding":
        setCodingEntries(newEntries);
        break;
      case "physical":
        setPhysicalEntries(newEntries);
        break;
      case "mentalHealth":
        setMentalHealthEntries(newEntries);
        break;
      default:
        console.error(`Invalid category: ${category}`);
    }
  };

  const getAllEntries = () => ({
    coding: codingEntries,
    physical: physicalEntries,
    mentalHealth: mentalHealthEntries,
  });

  const clearAllEntries = () => {
    setCodingEntries([]);
    setPhysicalEntries([]);
    setMentalHealthEntries([]);
  };

  const getEntriesByCategory = (category) => {
    switch (category) {
      case "coding":
        return codingEntries;
      case "physical":
        return physicalEntries;
      case "mentalHealth":
        return mentalHealthEntries;
      default:
        console.error(`Invalid category: ${category}`);
        return [];
    }
  };

  return {
    // Individual category data
    codingEntries,
    physicalEntries,
    mentalHealthEntries,

    // Individual category setters
    setCodingEntries,
    setPhysicalEntries,
    setMentalHealthEntries,

    // Utility functions
    updateEntries,
    getAllEntries,
    clearAllEntries,
    getEntriesByCategory,
  };
};
