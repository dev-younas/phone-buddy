import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Image, Text, Dimensions } from "react-native";
import { useApp } from "@/context/AppContext";
import { DeviceModal } from "@/components/DeviceModal";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

type Phase = "splash" | "loading" | "modal" | "welcome" | "done";

export default function IndexScreen() {
  const { deviceType, setDeviceType, hasCompletedOnboarding, setHasCompletedOnboarding, isLoaded } = useApp();
  const colors = useColors();
  const [phase, setPhase] = useState<Phase>("splash");

  const splashOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotateY = useRef(new Animated.Value(1)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(20)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    );
    shimmerLoop.start();

    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 52, friction: 7, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(logoRotateY, { toValue: 0, tension: 45, friction: 9, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(taglineSlide, { toValue: 0, tension: 65, friction: 8, useNativeDriver: true }),
      ]),
      Animated.delay(900),
      Animated.timing(splashOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => {
      shimmerLoop.stop();
      setPhase("loading");
    });
  }, []);

  useEffect(() => {
    if (phase === "loading" && isLoaded) {
      if (deviceType && hasCompletedOnboarding) {
        router.replace("/(tabs)/learn");
        setPhase("done");
      } else if (deviceType) {
        setPhase("welcome");
      } else {
        setPhase("modal");
      }
    }
  }, [phase, isLoaded, deviceType, hasCompletedOnboarding]);

  function handleDeviceSelect(device: "android" | "apple") {
    setDeviceType(device);
    setPhase("welcome");
  }

  function handleGetStarted() {
    setHasCompletedOnboarding(true);
    router.replace("/(tabs)/learn");
    setPhase("done");
  }

  return (
    <View style={[s.root, { backgroundColor: colors.lavender }]}>
      {(phase === "welcome" && deviceType) && (
        <WelcomeScreen deviceType={deviceType} onGetStarted={handleGetStarted} />
      )}
      {phase === "modal" && (
        <DeviceModal visible={true} onSelect={handleDeviceSelect} />
      )}

      {phase === "splash" && (
        <Animated.View
          pointerEvents="none"
          style={[s.splashOverlay, { opacity: splashOpacity, backgroundColor: colors.lavender }]}
        >
          <Animated.View
            style={{
              alignItems: "center",
              transform: [
                { perspective: 900 },
                { scale: logoScale },
                {
                  rotateY: logoRotateY.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "90deg"],
                  }),
                },
              ],
              opacity: logoOpacity,
            }}
          >
            <View style={[s.logoShadow, { shadowColor: colors.primary }]}>
              <Image
                source={require("../assets/logo.jpeg")}
                style={s.logoImage}
                resizeMode="contain"
              />
            </View>
            <Animated.View
              style={[
                s.shimmerBar,
                { backgroundColor: colors.steelBlue },
                {
                  opacity: shimmer.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.5, 0],
                  }),
                  transform: [
                    {
                      scaleX: shimmer.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1.4],
                      }),
                    },
                  ],
                },
              ]}
            />
          </Animated.View>
          <Animated.Text
            style={[
              s.tagline,
              { color: colors.mutedForeground },
              { opacity: taglineOpacity, transform: [{ translateY: taglineSlide }] },
            ]}
          >
            Your friendly phone guide
          </Animated.Text>
        </Animated.View>
      )}

      {phase === "loading" && (
        <Animated.View
          pointerEvents="none"
          style={[s.splashOverlay, { opacity: splashOpacity, backgroundColor: colors.lavender }]}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    zIndex: 999,
  },
  logoShadow: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 22,
    elevation: 14,
  },
  logoImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  shimmerBar: {
    height: 4,
    width: 120,
    borderRadius: 2,
    marginTop: 16,
  },
  tagline: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
    marginTop: 8,
  },
});
