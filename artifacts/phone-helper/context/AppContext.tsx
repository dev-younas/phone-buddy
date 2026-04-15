import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type DeviceType = "android" | "apple" | null;

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

interface AppContextType {
  deviceType: DeviceType;
  setDeviceType: (type: DeviceType) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (v: boolean) => void;
  tutorialProgress: Record<string, number>;
  setTutorialProgress: (tutorialId: string, step: number) => void;
  referralCode: string;
  referralCount: number;
  incrementReferralCount: () => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [deviceType, setDeviceTypeState] = useState<DeviceType>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);
  const [tutorialProgress, setTutorialProgressState] = useState<Record<string, number>>({});
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

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
        if (parsed.referralCount != null) setReferralCount(parsed.referralCount);
        if (parsed.referralCode) {
          setReferralCode(parsed.referralCode);
        } else {
          const code = generateReferralCode();
          setReferralCode(code);
          saveStatePartial({ referralCode: code });
        }
      } else {
        const code = generateReferralCode();
        setReferralCode(code);
        saveStatePartial({ referralCode: code });
      }
    } catch (e) {
      const code = generateReferralCode();
      setReferralCode(code);
    } finally {
      setIsLoaded(true);
    }
  }

  async function saveStatePartial(updates: Record<string, any>) {
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
    saveStatePartial({ deviceType: type });
  }

  function setHasCompletedOnboarding(v: boolean) {
    setHasCompletedOnboardingState(v);
    saveStatePartial({ hasCompletedOnboarding: v });
  }

  function setTutorialProgress(tutorialId: string, step: number) {
    const updated = { ...tutorialProgress, [tutorialId]: step };
    setTutorialProgressState(updated);
    saveStatePartial({ tutorialProgress: updated });
  }

  function incrementReferralCount() {
    const next = referralCount + 1;
    setReferralCount(next);
    saveStatePartial({ referralCount: next });
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
        referralCode,
        referralCount,
        incrementReferralCount,
        isLoaded,
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
