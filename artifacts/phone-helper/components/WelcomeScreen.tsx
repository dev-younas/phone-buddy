import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { DeviceType } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

interface WelcomeScreenProps {
  deviceType: DeviceType;
  onGetStarted: () => void;
}

export function WelcomeScreen({ deviceType, onGetStarted }: WelcomeScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isAndroid = deviceType === "android";

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.spring(iconAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  function handleGetStarted() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onGetStarted();
  }

  const features = isAndroid
    ? [
        { icon: "message-circle", text: "Install WhatsApp on your Android phone" },
        { icon: "wifi", text: "Connect to Wi-Fi easily" },
        { icon: "battery", text: "Fix common Android problems" },
        { icon: "settings", text: "Manage your Android settings" },
      ]
    : [
        { icon: "message-circle", text: "Install WhatsApp on your iPhone" },
        { icon: "cloud", text: "Use iCloud and App Store" },
        { icon: "lock", text: "Set up Face ID and passcode" },
        { icon: "settings", text: "Manage your iPhone settings" },
      ];

  const s = styles(colors, insets);

  return (
    <Animated.View
      style={[
        s.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={s.heroSection}>
        <Animated.View style={[s.iconRing, { transform: [{ scale: pulseAnim }] }]}>
          <Animated.View
            style={[
              s.iconInner,
              {
                transform: [
                  {
                    scale: iconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Feather
              name={isAndroid ? "cpu" : "monitor"}
              size={56}
              color="#ffffff"
            />
          </Animated.View>
        </Animated.View>

        <Text style={s.greeting}>Welcome!</Text>
        <Text style={s.headline}>
          {isAndroid
            ? "Your Android Phone Guide"
            : "Your iPhone Guide"}
        </Text>
        <Text style={s.tagline}>
          {isAndroid
            ? "We will help you learn how to use your Android phone, step by step."
            : "We will help you learn how to use your iPhone, step by step."}
        </Text>
      </View>

      <View style={s.featuresContainer}>
        <Text style={s.featuresTitle}>What you will learn:</Text>
        {features.map((feature, i) => (
          <Animated.View
            key={i}
            style={[
              s.featureRow,
              {
                opacity: iconAnim,
                transform: [
                  {
                    translateX: iconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={s.featureIconBox}>
              <Feather name={feature.icon as any} size={22} color={colors.primary} />
            </View>
            <Text style={s.featureText}>{feature.text}</Text>
          </Animated.View>
        ))}
      </View>

      <TouchableOpacity
        style={s.button}
        onPress={handleGetStarted}
        activeOpacity={0.85}
      >
        <Text style={s.buttonText}>Let's Get Started</Text>
        <Feather name="arrow-right" size={22} color="#ffffff" style={{ marginLeft: 8 }} />
      </TouchableOpacity>

      <Text style={s.reassurance}>
        Don't worry — we will go slowly and explain everything clearly
      </Text>
    </Animated.View>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.lavender,
      paddingHorizontal: 24,
      paddingTop: Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top + 20,
      paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
    },
    heroSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    iconRing: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.steelBlue,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 10,
    },
    iconInner: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    greeting: {
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      color: colors.muted,
      marginBottom: 6,
    },
    headline: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      textAlign: "center",
      marginBottom: 12,
    },
    tagline: {
      fontSize: 18,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 28,
      paddingHorizontal: 8,
    },
    featuresContainer: {
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 20,
      marginBottom: 28,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    featuresTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      marginBottom: 16,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 14,
    },
    featureIconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.lavender,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    featureText: {
      fontSize: 17,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      flex: 1,
      lineHeight: 24,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 10,
      minHeight: 64,
    },
    buttonText: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    reassurance: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 22,
    },
  });
