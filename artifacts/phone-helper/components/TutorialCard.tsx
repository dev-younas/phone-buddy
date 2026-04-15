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
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shadowElev = useRef(new Animated.Value(0)).current;

  const isComplete = totalSteps > 0 && progress >= totalSteps;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => Platform.OS !== "web",
      onPanResponderGrant: () => {
        Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, tension: 100, friction: 6 }).start();
        Animated.timing(shadowElev, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      },
      onPanResponderMove: (_, gestureState) => {
        const tiltX = -(gestureState.dy / 8);
        const tiltY = gestureState.dx / 8;
        rotateX.setValue(Math.max(-6, Math.min(6, tiltX)));
        rotateY.setValue(Math.max(-8, Math.min(8, tiltY)));
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(rotateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(rotateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.timing(shadowElev, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(rotateX, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(rotateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 6 }),
          Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
        ]).start();
      },
    })
  ).current;

  const s = styles(colors, isComplete);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        s.cardWrapper,
        {
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
      <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
        <View style={s.row}>
          <View style={[s.iconBox, isComplete && s.iconBoxComplete]}>
            <Feather
              name={icon as any}
              size={28}
              color={isComplete ? "#fff" : colors.primary}
            />
          </View>
          <View style={s.content}>
            <View style={s.titleRow}>
              <Text style={s.title}>{title}</Text>
              {badge && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{badge}</Text>
                </View>
              )}
              {isComplete && (
                <View style={s.completeBadge}>
                  <Feather name="check" size={12} color="#fff" />
                </View>
              )}
            </View>
            <Text style={s.description}>{description}</Text>
            {totalSteps > 0 && (
              <View style={s.progressRow}>
                <View style={s.progressBar}>
                  <Animated.View
                    style={[
                      s.progressFill,
                      { width: `${Math.min((progress / totalSteps) * 100, 100)}%` },
                      isComplete && s.progressComplete,
                    ]}
                  />
                </View>
                <Text style={s.progressText}>
                  {isComplete ? "Done!" : progress > 0 ? `${progress}/${totalSteps}` : `${totalSteps} steps`}
                </Text>
              </View>
            )}
          </View>
          <Feather name="chevron-right" size={22} color={colors.muted} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = (colors: ReturnType<typeof useColors>, isComplete: boolean) =>
  StyleSheet.create({
    cardWrapper: {
      marginBottom: 14,
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: 22,
      padding: 18,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 5,
      borderWidth: isComplete ? 2 : 0,
      borderColor: isComplete ? colors.success : "transparent",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconBox: {
      width: 62,
      height: 62,
      borderRadius: 18,
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
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.success,
      alignItems: "center",
      justifyContent: "center",
    },
    description: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 21,
      marginBottom: 10,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    progressBar: {
      flex: 1,
      height: 7,
      backgroundColor: colors.lavender,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.secondary,
      borderRadius: 4,
    },
    progressComplete: {
      backgroundColor: colors.success,
    },
    progressText: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
      minWidth: 52,
      textAlign: "right",
    },
  });
