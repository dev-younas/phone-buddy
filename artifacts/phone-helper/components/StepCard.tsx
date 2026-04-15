import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
  isActive: boolean;
  isCompleted: boolean;
}

export function StepCard({
  stepNumber,
  title,
  description,
  tip,
  isActive,
  isCompleted,
}: StepCardProps) {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.97)).current;
  const fadeAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.97,
        tension: 70,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: isActive ? 1 : isCompleted ? 0.8 : 0.6,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, isCompleted]);

  const s = styles(colors, isActive, isCompleted);

  return (
    <Animated.View
      style={[
        s.card,
        { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
      ]}
    >
      <View style={s.stepNumberContainer}>
        {isCompleted ? (
          <View style={s.checkCircle}>
            <Feather name="check" size={18} color="#ffffff" />
          </View>
        ) : (
          <View style={[s.stepCircle, isActive && s.stepCircleActive]}>
            <Text style={[s.stepNumber, isActive && s.stepNumberActive]}>
              {stepNumber}
            </Text>
          </View>
        )}
        <View style={s.connector} />
      </View>
      <View style={s.content}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.description}>{description}</Text>
        {tip && isActive && (
          <View style={s.tipBox}>
            <Feather name="info" size={16} color={colors.secondary} style={{ marginRight: 8 }} />
            <Text style={s.tipText}>{tip}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = (
  colors: ReturnType<typeof useColors>,
  isActive: boolean,
  isCompleted: boolean
) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      marginBottom: 4,
      padding: 16,
      borderRadius: 16,
      backgroundColor: isActive
        ? "#ffffff"
        : isCompleted
        ? colors.lavender
        : "transparent",
      borderWidth: isActive ? 2 : 0,
      borderColor: isActive ? colors.primary : "transparent",
      shadowColor: isActive ? colors.primary : "transparent",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isActive ? 0.15 : 0,
      shadowRadius: 8,
      elevation: isActive ? 4 : 0,
    },
    stepNumberContainer: {
      alignItems: "center",
      marginRight: 14,
      width: 36,
    },
    checkCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.success,
      alignItems: "center",
      justifyContent: "center",
    },
    stepCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.steelBlue,
      alignItems: "center",
      justifyContent: "center",
    },
    stepCircleActive: {
      backgroundColor: colors.primary,
    },
    stepNumber: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
    },
    stepNumberActive: {
      color: "#ffffff",
    },
    connector: {
      width: 2,
      flex: 1,
      backgroundColor: colors.steelBlue,
      marginTop: 4,
      minHeight: 12,
    },
    content: {
      flex: 1,
      paddingBottom: 8,
    },
    title: {
      fontSize: 19,
      fontFamily: "Inter_600SemiBold",
      color: isActive ? colors.primary : isCompleted ? colors.muted : colors.foreground,
      marginBottom: 6,
    },
    description: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: isActive ? colors.foreground : colors.mutedForeground,
      lineHeight: 26,
      marginBottom: 4,
    },
    tipBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.lavender,
      borderRadius: 10,
      padding: 12,
      marginTop: 8,
    },
    tipText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.secondary,
      flex: 1,
      lineHeight: 21,
    },
  });
