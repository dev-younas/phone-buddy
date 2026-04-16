import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export type DeviceType = "android" | "apple" | null;

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: number;
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
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  chatUnread: number;
  setChatUnread: (n: number) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [deviceType, setDeviceTypeState] = useState<DeviceType>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);
  const [tutorialProgress, setTutorialProgressState] = useState<Record<string, number>>({});
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkModeState] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatUnread, setChatUnread] = useState(0);

  useEffect(() => {
    loadState();
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      // Only apply system preference if user hasn't overridden
    });
    return () => sub?.remove();
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
        if (parsed.isDarkMode != null) setIsDarkModeState(parsed.isDarkMode);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        if (parsed.chatUnread != null) setChatUnread(parsed.chatUnread);
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
        const welcome: ChatMessage = {
          id: "welcome",
          text: "Hi there! 👋 Welcome to PhoneBuddy support! I'm Sarah, your support buddy. How can I help you today?",
          sender: "agent",
          timestamp: Date.now(),
        };
        setChatMessages([welcome]);
        saveStatePartial({ referralCode: code, isDarkMode: false, chatMessages: [welcome] });
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

  function setIsDarkMode(v: boolean) {
    setIsDarkModeState(v);
    saveStatePartial({ isDarkMode: v });
  }

  function addChatMessage(msg: ChatMessage) {
    setChatMessages((prev) => {
      const next = [...prev, msg];
      saveStatePartial({ chatMessages: next });
      return next;
    });
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
        isDarkMode,
        setIsDarkMode,
        chatMessages,
        addChatMessage,
        chatUnread,
        setChatUnread,
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
