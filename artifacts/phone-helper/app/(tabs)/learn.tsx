import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
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
  const slideAnim = useRef(new Animated.Value(20)).current;

  const isAndroid = deviceType === "android";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const s = styles(colors, insets);

  return (
    <Animated.ScrollView
      style={[s.container, { opacity: fadeAnim }]}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>
              {isAndroid ? "Android Tutorials" : "iPhone Tutorials"}
            </Text>
            <Text style={s.subtitle}>Tap any topic to start learning</Text>
          </View>
          <View style={s.deviceBadge}>
            <Feather
              name={isAndroid ? "cpu" : "monitor"}
              size={20}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>App Tutorials</Text>
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
          <Feather name="star" size={22} color={colors.secondary} />
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
      justifyContent: "space-between",
      marginBottom: 28,
    },
    greeting: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    deviceBadge: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.steelBlue,
      alignItems: "center",
      justifyContent: "center",
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 14,
    },
    tipsCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      gap: 8,
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
