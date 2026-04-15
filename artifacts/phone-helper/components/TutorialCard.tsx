import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface TutorialCardProps {
  icon: string;
  title: string;
  description: string;
  progress?: number;
  totalSteps?: number;
  onPress: () => void;
  badge?: string;
}

export function TutorialCard({
  icon,
  title,
  description,
  progress = 0,
  totalSteps = 0,
  onPress,
  badge,
}: TutorialCardProps) {
  const colors = useColors();
  const isComplete = totalSteps > 0 && progress >= totalSteps;
  const hasProgress = progress > 0 && !isComplete;

  return (
    <TouchableOpacity
      style={styles(colors).card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles(colors).row}>
        <View style={[styles(colors).iconBox, isComplete && styles(colors).iconBoxComplete]}>
          <Feather
            name={icon as any}
            size={28}
            color={isComplete ? "#fff" : colors.primary}
          />
        </View>
        <View style={styles(colors).content}>
          <View style={styles(colors).titleRow}>
            <Text style={styles(colors).title}>{title}</Text>
            {badge && (
              <View style={styles(colors).badge}>
                <Text style={styles(colors).badgeText}>{badge}</Text>
              </View>
            )}
            {isComplete && (
              <View style={styles(colors).completeBadge}>
                <Feather name="check" size={12} color="#fff" />
              </View>
            )}
          </View>
          <Text style={styles(colors).description}>{description}</Text>
          {totalSteps > 0 && (
            <View style={styles(colors).progressRow}>
              <View style={styles(colors).progressBar}>
                <View
                  style={[
                    styles(colors).progressFill,
                    { width: `${Math.min((progress / totalSteps) * 100, 100)}%` },
                    isComplete && styles(colors).progressComplete,
                  ]}
                />
              </View>
              <Text style={styles(colors).progressText}>
                {isComplete ? "Done!" : `${progress}/${totalSteps} steps`}
              </Text>
            </View>
          )}
        </View>
        <Feather name="chevron-right" size={22} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 18,
      marginBottom: 14,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconBox: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: colors.lavender,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    iconBoxComplete: {
      backgroundColor: colors.success,
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      flexWrap: "wrap",
      gap: 6,
    },
    title: {
      fontSize: 19,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
    },
    badge: {
      backgroundColor: colors.secondary,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    badgeText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "#ffffff",
    },
    completeBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.success,
      alignItems: "center",
      justifyContent: "center",
    },
    description: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 22,
      marginBottom: 8,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: colors.lavender,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.secondary,
      borderRadius: 3,
    },
    progressComplete: {
      backgroundColor: colors.success,
    },
    progressText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      minWidth: 60,
    },
  });
