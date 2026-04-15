import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useApp } from "@/context/AppContext";
import { DeviceModal } from "@/components/DeviceModal";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

type Phase = "loading" | "modal" | "welcome" | "redirect";

export default function IndexScreen() {
  const { deviceType, setDeviceType, hasCompletedOnboarding, setHasCompletedOnboarding } = useApp();
  const colors = useColors();
  const [phase, setPhase] = useState<Phase>("loading");
  const loadFade = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
    );
    spin.start();
    return () => spin.stop();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (deviceType && hasCompletedOnboarding) {
        setPhase("redirect");
      } else if (deviceType && !hasCompletedOnboarding) {
        setPhase("welcome");
      } else {
        setPhase("modal");
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [deviceType, hasCompletedOnboarding]);

  useEffect(() => {
    if (phase === "redirect") {
      router.replace("/(tabs)/learn");
    }
  }, [phase]);

  function handleDeviceSelect(device: "android" | "apple") {
    setDeviceType(device);
    setPhase("welcome");
  }

  function handleGetStarted() {
    setHasCompletedOnboarding(true);
    router.push("/(tabs)/learn");
  }

  if (phase === "redirect") {
    return <View style={[styles.container, { backgroundColor: colors.lavender }]} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.lavender }]}>
      {phase === "loading" && (
        <Animated.View style={styles.loadingContainer}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: spinAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <Feather name="loader" size={40} color={colors.primary} />
          </Animated.View>
        </Animated.View>
      )}

      {phase === "modal" && (
        <DeviceModal visible={true} onSelect={handleDeviceSelect} />
      )}

      {phase === "welcome" && deviceType && (
        <WelcomeScreen deviceType={deviceType} onGetStarted={handleGetStarted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
