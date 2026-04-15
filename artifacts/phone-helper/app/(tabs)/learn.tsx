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

export default function LearnScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType, tutorialProgress } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  const isAndroid = deviceType === "android";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 8, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 7, delay: 80, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 450, delay: 80, useNativeDriver: true }),
      Animated.spring(logoRotate, { toValue: 1, tension: 50, friction: 9, delay: 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const completedCount = Object.values(tutorialProgress).filter(
    (v) => v > 0
  ).length;

  const s = styles(colors, insets);

  return (
    <Animated.ScrollView
      style={[s.container, { opacity: fadeAnim }]}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <View style={s.header}>
          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [
                { perspective: 700 },
                { scale: logoScale },
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

          <View style={s.headerTextBlock}>
            <Text style={s.appName}>PhoneBuddy</Text>
            <Text style={s.subtitle}>
              {isAndroid ? "Android Tutorials" : "iPhone Tutorials"}
            </Text>
          </View>

          <View style={s.deviceBadge}>
            <Feather
              name={isAndroid ? "cpu" : "monitor"}
              size={20}
              color={colors.primary}
            />
          </View>
        </View>

        {completedCount > 0 && (
          <View style={[s.progressBanner, { backgroundColor: colors.primary }]}>
            <Feather name="trending-up" size={18} color="#ffffff" />
            <Text style={s.progressBannerText}>
              Great job! You have started {completedCount} tutorial{completedCount !== 1 ? "s" : ""}
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
              totalSteps={
                isAndroid
                  ? tutorial.androidSteps.length
                  : tutorial.appleSteps.length
              }
              onPress={() => router.push(`/tutorial/${tutorial.id}`)}
            />
          ))}
        </View>

        <View style={s.tipsCard}>
          <View style={s.tipsIconRow}>
            <Feather name="star" size={20} color="#ffffff" />
          </View>
          <Text style={s.tipsTitle}>Quick Tip</Text>
          <Text style={s.tipsText}>
            You can always come back to where you left off — your progress is saved automatically!
          </Text>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.lavender,
    },
    scrollContent: {
      paddingTop: Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top + 16,
      paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      gap: 12,
    },
    logoContainer: {
      width: 58,
      height: 58,
      borderRadius: 29,
      overflow: "hidden",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 6,
    },
    logoImage: {
      width: 58,
      height: 58,
      borderRadius: 29,
    },
    headerTextBlock: {
      flex: 1,
    },
    appName: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      lineHeight: 30,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    deviceBadge: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.steelBlue,
      alignItems: "center",
      justifyContent: "center",
    },
    progressBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 20,
    },
    progressBannerText: {
      fontSize: 15,
      fontFamily: "Inter_500Medium",
      color: "#ffffff",
      flex: 1,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    tipsCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 22,
      alignItems: "center",
      gap: 6,
    },
    tipsIconRow: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    tipsTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    tipsText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.85)",
      textAlign: "center",
      lineHeight: 24,
    },
  });
