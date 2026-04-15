import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { commonIssues } from "@/data/tutorials";
import * as Haptics from "expo-haptics";

export default function HelpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const isAndroid = deviceType === "android";

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  function toggleIssue(id: string) {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setExpandedId(expandedId === id ? null : id);
  }

  const s = styles(colors, insets);

  return (
    <Animated.ScrollView
      style={[s.container, { opacity: fadeAnim }]}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={s.title}>Common Problems</Text>
        <Text style={s.subtitle}>
          Tap a problem below to see how to fix it
        </Text>
      </View>

      <View style={s.sosCard}>
        <View style={s.sosIconBox}>
          <Feather name="phone-call" size={28} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.sosTitle}>Need more help?</Text>
          <Text style={s.sosText}>
            Ask a family member or visit your phone store
          </Text>
        </View>
      </View>

      {commonIssues.map((issue) => {
        const isExpanded = expandedId === issue.id;
        const solution = isAndroid ? issue.androidSolution : issue.appleSolution;

        return (
          <TouchableOpacity
            key={issue.id}
            style={[s.issueCard, isExpanded && s.issueCardExpanded]}
            onPress={() => toggleIssue(issue.id)}
            activeOpacity={0.85}
          >
            <View style={s.issueRow}>
              <View style={[s.issueIcon, isExpanded && s.issueIconActive]}>
                <Feather
                  name={issue.icon as any}
                  size={24}
                  color={isExpanded ? "#ffffff" : colors.primary}
                />
              </View>
              <View style={s.issueContent}>
                <Text style={[s.issueTitle, isExpanded && s.issueTitleActive]}>
                  {issue.title}
                </Text>
                <Text style={s.issueDescription}>{issue.description}</Text>
              </View>
              <Feather
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={22}
                color={isExpanded ? colors.primary : colors.muted}
              />
            </View>
            {isExpanded && (
              <View style={s.solutionContainer}>
                <View style={s.divider} />
                <Text style={s.solutionLabel}>How to fix this:</Text>
                <Text style={s.solutionText}>{solution}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <View style={s.reassureCard}>
        <Feather name="heart" size={20} color={colors.secondary} />
        <Text style={s.reassureText}>
          These problems are very common — you haven't broken anything! Most issues can be fixed with a simple restart.
        </Text>
      </View>
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
      marginBottom: 24,
    },
    title: {
      fontSize: 30,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 24,
    },
    sosCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    sosIconBox: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    sosTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      marginBottom: 2,
    },
    sosText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.85)",
      lineHeight: 20,
    },
    issueCard: {
      backgroundColor: "#ffffff",
      borderRadius: 18,
      padding: 18,
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    issueCardExpanded: {
      borderWidth: 2,
      borderColor: colors.primary,
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    issueRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    issueIcon: {
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: colors.lavender,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    issueIconActive: {
      backgroundColor: colors.primary,
    },
    issueContent: {
      flex: 1,
    },
    issueTitle: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 3,
    },
    issueTitleActive: {
      color: colors.primary,
    },
    issueDescription: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    solutionContainer: {
      marginTop: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.lavender,
      marginVertical: 14,
    },
    solutionLabel: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      marginBottom: 10,
    },
    solutionText: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.foreground,
      lineHeight: 28,
    },
    reassureCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.steelBlue,
      borderRadius: 16,
      padding: 16,
      gap: 10,
      marginTop: 4,
    },
    reassureText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.primary,
      flex: 1,
      lineHeight: 24,
    },
  });
