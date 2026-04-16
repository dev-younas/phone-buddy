import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { DeviceType } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

interface WelcomeScreenProps {
  deviceType: DeviceType;
  onGetStarted: () => void;
}

export function WelcomeScreen({ deviceType, onGetStarted }: WelcomeScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isAndroid = deviceType === "android";

  const masterFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(50)).current;
  const iconSpin = useRef(new Animated.Value(0)).current;
  const iconFloat = useRef(new Animated.Value(0)).current;
  const iconRotateY = useRef(new Animated.Value(0)).current;
  const ringPulse = useRef(new Animated.Value(1)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const featureSlide1 = useRef(new Animated.Value(40)).current;
  const featureSlide2 = useRef(new Animated.Value(40)).current;
  const featureSlide3 = useRef(new Animated.Value(40)).current;
  const featureSlide4 = useRef(new Animated.Value(40)).current;
  const featureOpacity1 = useRef(new Animated.Value(0)).current;
  const featureOpacity2 = useRef(new Animated.Value(0)).current;
  const featureOpacity3 = useRef(new Animated.Value(0)).current;
  const featureOpacity4 = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.88)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(masterFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(heroSlide, { toValue: 0, tension: 65, friction: 9, useNativeDriver: true }),
      ]),
      Animated.spring(iconSpin, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
      Animated.stagger(100, [
        Animated.parallel([
          Animated.spring(featureSlide1, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
          Animated.timing(featureOpacity1, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(featureSlide2, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
          Animated.timing(featureOpacity2, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(featureSlide3, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
          Animated.timing(featureOpacity3, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.spring(featureSlide4, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
          Animated.timing(featureOpacity4, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]),
      ]),
      Animated.parallel([
        Animated.spring(buttonScale, { toValue: 1, tension: 65, friction: 7, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloat, { toValue: -10, duration: 1800, useNativeDriver: true }),
        Animated.timing(iconFloat, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    floatLoop.start();

    const rotateLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(iconRotateY, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(iconRotateY, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ])
    );
    rotateLoop.start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulse, { toValue: 1.12, duration: 1600, useNativeDriver: true }),
        Animated.timing(ringPulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();

    const ringLoop = Animated.loop(
      Animated.timing(ringRotate, { toValue: 1, duration: 8000, useNativeDriver: true })
    );
    ringLoop.start();

    return () => {
      floatLoop.stop();
      rotateLoop.stop();
      pulseLoop.stop();
      ringLoop.stop();
    };
  }, []);

  function handleGetStarted() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(buttonScale, {
      toValue: 0.93,
      tension: 200,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 200,
        friction: 5,
        useNativeDriver: true,
      }).start(onGetStarted);
    });
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

  const featureAnims = [
    { slide: featureSlide1, opacity: featureOpacity1 },
    { slide: featureSlide2, opacity: featureOpacity2 },
    { slide: featureSlide3, opacity: featureOpacity3 },
    { slide: featureSlide4, opacity: featureOpacity4 },
  ];

  const s = styles(colors, insets);

  return (
    <Animated.View style={[s.container, { opacity: masterFade }]}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[s.heroSection, { transform: [{ translateY: heroSlide }] }]}
        >
          <View style={s.orbitRingContainer}>
            <Animated.View
              style={[
                s.orbitRing,
                {
                  transform: [
                    { scale: ringPulse },
                    {
                      rotate: ringRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={s.orbitDot1} />
              <View style={s.orbitDot2} />
              <View style={s.orbitDot3} />
            </Animated.View>

            <Animated.View
              style={[
                s.iconOuter,
                {
                  transform: [
                    { translateY: iconFloat },
                    { perspective: 800 },
                    {
                      rotateY: iconRotateY.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: ["0deg", "14deg", "0deg"],
                      }),
                    },
                    {
                      scale: iconSpin.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.4, 1],
                      }),
                    },
                  ],
                  opacity: iconSpin,
                },
              ]}
            >
              <Image
                source={require("../assets/logo.jpeg")}
                style={s.logoImage}
                resizeMode="cover"
              />
            </Animated.View>
          </View>

          <Text style={s.greeting}>Welcome!</Text>
          <Text style={s.headline}>
            {isAndroid ? "Your Android Phone Guide" : "Your iPhone Guide"}
          </Text>
          <Text style={s.tagline}>
            {isAndroid
              ? "We will help you learn how to use your Android phone, step by step."
              : "We will help you learn how to use your iPhone, step by step."}
          </Text>
        </Animated.View>

        <View style={s.featuresContainer}>
          <Text style={s.featuresTitle}>What you will learn:</Text>
          {features.map((feature, i) => (
            <Animated.View
              key={i}
              style={[
                s.featureRow,
                {
                  opacity: featureAnims[i].opacity,
                  transform: [{ translateX: featureAnims[i].slide }],
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

        <Animated.View
          style={{
            transform: [{ scale: buttonScale }],
            opacity: buttonOpacity,
          }}
        >
          <TouchableOpacity style={s.button} onPress={handleGetStarted} activeOpacity={0.88}>
            <Text style={s.buttonText}>Let's Get Started</Text>
            <View style={s.buttonArrow}>
              <Feather name="arrow-right" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text style={s.reassurance}>
          Don't worry — we will go slowly and explain everything clearly
        </Text>
      </ScrollView>
    </Animated.View>
  );
}

const styles = (
  colors: ReturnType<typeof useColors>,
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.lavender,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top + 16,
      paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20,
    },
    heroSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    orbitRingContainer: {
      width: 170,
      height: 170,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    orbitRing: {
      position: "absolute",
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 1.5,
      borderColor: colors.steelBlue,
      borderStyle: "dashed",
    },
    orbitDot1: {
      position: "absolute",
      top: -5,
      left: "50%",
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.secondary,
      marginLeft: -5,
    },
    orbitDot2: {
      position: "absolute",
      bottom: 12,
      left: 12,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.muted,
    },
    orbitDot3: {
      position: "absolute",
      bottom: 12,
      right: 12,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    iconOuter: {
      width: 134,
      height: 134,
      borderRadius: 67,
      overflow: "hidden",
      backgroundColor: colors.steelBlue,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.35,
      shadowRadius: 22,
      elevation: 14,
    },
    logoImage: {
      width: 134,
      height: 134,
      borderRadius: 67,
    },
    greeting: {
      fontSize: 22,
      fontFamily: "Inter_500Medium",
      color: colors.muted,
      marginBottom: 6,
    },
    headline: {
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      textAlign: "center",
      marginBottom: 14,
    },
    tagline: {
      fontSize: 21,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 33,
      paddingHorizontal: 12,
    },
    featuresContainer: {
      backgroundColor: "#ffffff",
      borderRadius: 22,
      padding: 24,
      marginBottom: 28,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 5,
    },
    featuresTitle: {
      fontSize: 22,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      marginBottom: 18,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    featureIconBox: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: colors.lavender,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    featureText: {
      fontSize: 20,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      flex: 1,
      lineHeight: 30,
    },
    button: {
      backgroundColor: "#ffffff",
      borderRadius: 22,
      paddingVertical: 24,
      paddingHorizontal: 28,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 2,
      borderColor: colors.steelBlue,
      minHeight: 76,
    },
    buttonText: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    buttonArrow: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.lavender,
      alignItems: "center",
      justifyContent: "center",
    },
    reassurance: {
      fontSize: 18,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 28,
      paddingBottom: 10,
    },
  });
