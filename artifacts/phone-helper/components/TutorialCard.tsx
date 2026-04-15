import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

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
  const { isDarkMode } = useApp();
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  const isComplete = totalSteps > 0 && progress >= totalSteps;
  const progressPct = totalSteps > 0 ? Math.min((progress / totalSteps) * 100, 100) : 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => Platform.OS !== "web",
      onPanResponderGrant: () => {
        Animated.parallel([
          Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 100, friction: 6 }),
          Animated.timing(glowOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderMove: (_, gs) => {
        rotateX.setValue(Math.max(-7, Math.min(7, -(gs.dy / 7))));
        rotateY.setValue(Math.max(-9, Math.min(9, gs.dx / 7)));
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(rotateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(rotateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.timing(glowOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(rotateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(rotateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.timing(glowOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
      },
    })
  ).current;

  function handlePress() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.94, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 180, friction: 5, useNativeDriver: true }),
    ]).start(onPress);
  }

  const cardBg = isDarkMode ? colors.card : "#FFFFFF";

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        {
          marginBottom: 16,
          transform: [
            { perspective: 1000 },
            {
              rotateX: rotateX.interpolate({
                inputRange: [-10, 10],
                outputRange: ["-10deg", "10deg"],
              }),
            },
            {
              rotateY: rotateY.interpolate({
                inputRange: [-10, 10],
                outputRange: ["-10deg", "10deg"],
              }),
            },
            { scale },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          s(colors, isComplete, cardBg).card,
        ]}
        onPress={handlePress}
        activeOpacity={0.92}
      >
        <Animated.View
          style={[
            s(colors, isComplete, cardBg).glowOverlay,
            { opacity: glowOpacity },
          ]}
        />
        <View style={s(colors, isComplete, cardBg).row}>
          <View style={[
            s(colors, isComplete, cardBg).iconBox,
            isComplete && { backgroundColor: colors.success },
          ]}>
            <Feather
              name={icon as any}
              size={32}
              color={isComplete ? "#fff" : colors.primary}
            />
          </View>
          <View style={s(colors, isComplete, cardBg).content}>
            <View style={s(colors, isComplete, cardBg).titleRow}>
              <Text style={[s(colors, isComplete, cardBg).title, { color: colors.foreground }]}>
                {title}
              </Text>
              {badge && (
                <View style={[s(colors, isComplete, cardBg).badge, { backgroundColor: colors.secondary }]}>
                  <Text style={s(colors, isComplete, cardBg).badgeText}>{badge}</Text>
                </View>
              )}
              {isComplete && (
                <View style={[s(colors, isComplete, cardBg).completeBadge, { backgroundColor: colors.success }]}>
                  <Feather name="check" size={13} color="#fff" />
                </View>
              )}
            </View>
            <Text style={[s(colors, isComplete, cardBg).description, { color: colors.mutedForeground }]}>
              {description}
            </Text>
            {totalSteps > 0 && (
              <View style={s(colors, isComplete, cardBg).progressRow}>
                <View style={[s(colors, isComplete, cardBg).progressBar, { backgroundColor: colors.muted }]}>
                  <View
                    style={[
                      s(colors, isComplete, cardBg).progressFill,
                      { width: `${progressPct}%`, backgroundColor: isComplete ? colors.success : colors.secondary },
                    ]}
                  />
                </View>
                <Text style={[s(colors, isComplete, cardBg).progressText, { color: colors.mutedForeground }]}>
                  {isComplete ? "Done! 🎉" : progress > 0 ? `${progress}/${totalSteps}` : `${totalSteps} steps`}
                </Text>
              </View>
            )}
          </View>
          <Feather name="chevron-right" size={24} color={colors.muted} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = (colors: ReturnType<typeof useColors>, isComplete: boolean, cardBg: string) =>
  StyleSheet.create({
    card: {
      backgroundColor: cardBg,
      borderRadius: 24,
      padding: 20,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: isComplete ? 2.5 : 0,
      borderColor: isComplete ? colors.success : "transparent",
      overflow: "hidden",
    },
    glowOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.primary,
      borderRadius: 24,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconBox: {
      width: 68,
      height: 68,
      borderRadius: 20,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
      flexWrap: "wrap",
      gap: 7,
    },
    title: {
      fontSize: 21,
      fontFamily: "Inter_700Bold",
    },
    badge: {
      borderRadius: 9,
      paddingHorizontal: 9,
      paddingVertical: 3,
    },
    badgeText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#ffffff",
    },
    completeBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    description: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      lineHeight: 22,
      marginBottom: 12,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    progressBar: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
    },
    progressText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      minWidth: 56,
      textAlign: "right",
    },
  });
