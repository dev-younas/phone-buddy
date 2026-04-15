import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { TutorialCard } from "@/components/TutorialCard";
import { tutorials } from "@/data/tutorials";
import * as Haptics from "expo-haptics";

export default function LearnScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType, tutorialProgress } = useApp();
  const isAndroid = deviceType === "android";

  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(contentSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 55, friction: 7, delay: 100, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 450, delay: 100, useNativeDriver: true }),
      Animated.spring(logoRotate, { toValue: 1, tension: 50, friction: 9, delay: 100, useNativeDriver: true }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, { toValue: -6, duration: 2200, useNativeDriver: true }),
        Animated.timing(logoFloat, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, []);

  const completedCount = Object.values(tutorialProgress).filter((v) => v > 0).length;
  const allCompleted = tutorials.every(
    (t) =>
      (tutorialProgress[t.id] ?? 0) >=
      (isAndroid ? t.androidSteps.length : t.appleSteps.length)
  );

  const parallaxHeaderTranslate = scrollY.interpolate({
    inputRange: [-100, 0, 200],
    outputRange: [50, 0, -60],
    extrapolate: "clamp",
  });
  const parallaxHeaderOpacity = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const parallaxHeaderScale = scrollY.interpolate({
    inputRange: [-80, 0],
    outputRange: [1.1, 1],
    extrapolate: "clamp",
  });

  const s = styles(colors, insets);

  return (
    <Animated.View style={[s.container, { opacity: fadeAnim }]}>
      <Animated.ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            s.heroSection,
            {
              transform: [
                { translateY: parallaxHeaderTranslate },
                { scale: parallaxHeaderScale },
              ],
              opacity: parallaxHeaderOpacity,
            },
          ]}
        >
          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [
                { perspective: 700 },
                { scale: logoScale },
                { translateY: logoFloat },
                {
                  rotateY: logoRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["45deg", "0deg"],
                  }),
                },
              ],
            }}
          >
            <View style={[s.logoContainer, { shadowColor: colors.primary }]}>
              <Image
                source={require("../../assets/logo.jpeg")}
                style={s.logoImage}
                resizeMode="cover"
              />
            </View>
          </Animated.View>

          <View style={s.heroText}>
            <Text style={s.appName}>PhoneBuddy</Text>
            <Text style={s.heroTagline}>
              {isAndroid ? "Android Tutorials" : "iPhone Tutorials"}
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: contentSlide }] }}>
          {allCompleted && tutorials.length > 0 && (
            <View style={[s.allDoneBanner, { backgroundColor: colors.success }]}>
              <Feather name="award" size={22} color="#fff" />
              <Text style={s.allDoneBannerText}>You have completed all tutorials — brilliant!</Text>
            </View>
          )}

          {completedCount > 0 && !allCompleted && (
            <View style={[s.progressBanner, { backgroundColor: colors.primary }]}>
              <Feather name="trending-up" size={20} color="#ffffff" />
              <Text style={s.progressBannerText}>
                Well done! You have started {completedCount} tutorial{completedCount !== 1 ? "s" : ""}
              </Text>
            </View>
          )}

          <View style={s.section}>
            <Text style={s.sectionTitle}>Step-by-Step Guides</Text>
            <Text style={s.sectionSubtitle}>Tap any guide to start — your progress is saved automatically</Text>
            {tutorials.map((tutorial) => (
              <TutorialCard
                key={tutorial.id}
                icon={tutorial.icon}
                title={tutorial.title}
                description={tutorial.description}
                badge={tutorial.badge}
                progress={tutorialProgress[tutorial.id] ?? 0}
                totalSteps={isAndroid ? tutorial.androidSteps.length : tutorial.appleSteps.length}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  router.push(`/tutorial/${tutorial.id}`);
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[s.chatPromptCard, { backgroundColor: colors.secondary }]}
            onPress={() => router.push("/(tabs)/chat")}
            activeOpacity={0.88}
          >
            <View style={s.chatPromptLeft}>
              <Text style={s.chatPromptEmoji}>👩‍💼</Text>
            </View>
            <View style={s.chatPromptText}>
              <Text style={s.chatPromptTitle}>Need extra help?</Text>
              <Text style={s.chatPromptSub}>Chat with Sarah from support — she's friendly!</Text>
            </View>
            <Feather name="chevron-right" size={22} color="#ffffff" />
          </TouchableOpacity>

          <View style={[s.tipsCard, { backgroundColor: colors.primary }]}>
            <View style={s.tipsIconRow}>
              <Feather name="star" size={22} color="#ffffff" />
            </View>
            <Text style={s.tipsTitle}>Quick Tip</Text>
            <Text style={s.tipsText}>
              You can always come back to where you left off — your progress is saved automatically!
            </Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingTop: Platform.OS === "web" ? Math.max(insets.top, 60) : insets.top + 8,
      paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 110,
    },
    heroSection: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 22,
      paddingBottom: 24,
      paddingTop: 12,
      gap: 16,
    },
    logoContainer: {
      width: 68,
      height: 68,
      borderRadius: 34,
      overflow: "hidden",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    logoImage: {
      width: 68,
      height: 68,
      borderRadius: 34,
    },
    heroText: {
      flex: 1,
    },
    appName: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      lineHeight: 36,
    },
    heroTagline: {
      fontSize: 17,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    allDoneBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 16,
      paddingHorizontal: 18,
      paddingVertical: 14,
      marginHorizontal: 20,
      marginBottom: 16,
    },
    allDoneBannerText: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: "#ffffff",
      flex: 1,
    },
    progressBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderRadius: 16,
      paddingHorizontal: 18,
      paddingVertical: 14,
      marginHorizontal: 20,
      marginBottom: 16,
    },
    progressBannerText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: "#ffffff",
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 18,
      lineHeight: 24,
    },
    chatPromptCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 20,
      padding: 18,
      marginHorizontal: 20,
      marginBottom: 20,
      gap: 14,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    chatPromptLeft: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.22)",
      alignItems: "center",
      justifyContent: "center",
    },
    chatPromptEmoji: { fontSize: 24 },
    chatPromptText: { flex: 1 },
    chatPromptTitle: {
      fontSize: 19,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      marginBottom: 2,
    },
    chatPromptSub: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.85)",
    },
    tipsCard: {
      borderRadius: 22,
      padding: 24,
      marginHorizontal: 20,
      alignItems: "center",
      gap: 8,
    },
    tipsIconRow: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    tipsTitle: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    tipsText: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.88)",
      textAlign: "center",
      lineHeight: 26,
    },
  });
