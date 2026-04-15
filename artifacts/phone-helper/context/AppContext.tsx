import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DeviceType = "android" | "apple" | null;

interface AppContextType {
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (v: boolean) => void;
  tutorialProgress: Record<string, number>;
  setTutorialProgress: (tutorialId: string, step: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [deviceType, setDeviceTypeState] = useState<DeviceType>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);
  const [tutorialProgress, setTutorialProgressState] = useState<Record<string, number>>({});

  useEffect(() => {
    loadState();
  }, []);

  async function loadState() {
    try {
      const stored = await AsyncStorage.getItem("@app_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.deviceType) setDeviceTypeState(parsed.deviceType);
        if (parsed.hasCompletedOnboarding) setHasCompletedOnboardingState(parsed.hasCompletedOnboarding);
        if (parsed.tutorialProgress) setTutorialProgressState(parsed.tutorialProgress);
      }
    } catch (e) {
      // ignore
    }
  }

  async function saveState(updates: Partial<{ deviceType: DeviceType; hasCompletedOnboarding: boolean; tutorialProgress: Record<string, number> }>) {
    try {
      const existing = await AsyncStorage.getItem("@app_state");
      const current = existing ? JSON.parse(existing) : {};
      await AsyncStorage.setItem("@app_state", JSON.stringify({ ...current, ...updates }));
    } catch (e) {
      // ignore
    }
  }

  function setDeviceType(type: DeviceType) {
    setDeviceTypeState(type);
    saveState({ deviceType: type });
  }

  function setHasCompletedOnboarding(v: boolean) {
    setHasCompletedOnboardingState(v);
    saveState({ hasCompletedOnboarding: v });
  }

  function setTutorialProgress(tutorialId: string, step: number) {
    const updated = { ...tutorialProgress, [tutorialId]: step };
    setTutorialProgressState(updated);
    saveState({ tutorialProgress: updated });
  }

  return (
    <AppContext.Provider
      value={{
        deviceType,
        setDeviceType,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        tutorialProgress,
        setTutorialProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
