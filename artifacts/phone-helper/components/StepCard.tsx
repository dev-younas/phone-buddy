import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
  image?: any;
  isActive: boolean;
  isCompleted: boolean;
}

export function StepCard({
  stepNumber,
  title,
  description,
  tip,
  image,
  isActive,
  isCompleted,
}: StepCardProps) {
  const colors = useColors();
  const { isDarkMode } = useApp();
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.97)).current;
  const fadeAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;
  const rotateX = useRef(new Animated.Value(isActive ? 0 : 3)).current;
  const imageReveal = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.86)).current;
  const tipPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.97,
        tension: 70,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: isActive ? 1 : isCompleted ? 0.82 : 0.52,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(rotateX, {
        toValue: isActive ? 0 : isCompleted ? 0 : 4,
        tension: 60,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();

    if (isActive && image) {
      Animated.parallel([
        Animated.timing(imageReveal, {
          toValue: 1,
          duration: 500,
          delay: 140,
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          tension: 52,
          friction: 8,
          delay: 140,
          useNativeDriver: true,
        }),
      ]).start();

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(tipPulse, { toValue: 1.02, duration: 1200, useNativeDriver: true }),
          Animated.timing(tipPulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      imageReveal.setValue(0);
      imageScale.setValue(0.86);
    }
  }, [isActive, isCompleted]);

  const cardBg = isActive
    ? isDarkMode ? colors.card : "#FFFFFF"
    : isCompleted
    ? isDarkMode ? colors.muted : colors.muted
    : "transparent";

  const borderColor = isActive ? colors.primary : "transparent";

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor,
          borderWidth: isActive ? 2.5 : 0,
          padding: isActive ? 20 : 14,
          shadowColor: isActive ? colors.primary : "transparent",
          shadowOpacity: isActive ? 0.18 : 0,
          opacity: fadeAnim,
          transform: [
            { perspective: 900 },
            { scale: scaleAnim },
            {
              rotateX: rotateX.interpolate({
                inputRange: [0, 10],
                outputRange: ["0deg", "10deg"],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.stepNumberContainer}>
          {isCompleted ? (
            <View style={[styles.checkCircle, { backgroundColor: colors.success }]}>
              <Feather name="check" size={20} color="#ffffff" />
            </View>
          ) : (
            <View style={[
              styles.stepCircle,
              { backgroundColor: isActive ? colors.primary : colors.muted },
            ]}>
              <Text style={[styles.stepNumber, { color: isActive ? "#ffffff" : colors.mutedForeground }]}>
                {stepNumber}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.titleBlock}>
          <Text style={[
            styles.title,
            { fontSize: isActive ? 22 : 18 },
            { color: isActive ? colors.primary : isCompleted ? colors.mutedForeground : colors.foreground },
          ]}>
            {title}
          </Text>
        </View>
      </View>

      {isActive && image && (
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageReveal,
              transform: [
                { perspective: 1000 },
                { scale: imageScale },
                {
                  translateY: imageReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.imageFrame, { backgroundColor: colors.muted }]}>
            <Image source={image} style={styles.image} resizeMode="cover" />
            <View style={styles.imageOverlay} />
            <View style={[styles.imageLabelBadge, { backgroundColor: "rgba(48,82,160,0.75)" }]}>
              <Feather name="eye" size={13} color="#ffffff" />
              <Text style={styles.imageLabelText}>What it looks like</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <Text style={[
        styles.description,
        { fontSize: isActive ? 18 : 16 },
        { lineHeight: isActive ? 29 : 23 },
        { color: isActive ? colors.foreground : colors.mutedForeground },
        { marginLeft: 52 },
      ]}>
        {description}
      </Text>

      {tip && isActive && (
        <Animated.View
          style={[
            styles.tipBox,
            { backgroundColor: isDarkMode ? colors.muted : colors.muted, marginLeft: 52 },
            { transform: [{ scale: tipPulse }] },
          ]}
        >
          <View style={[styles.tipIconBox, { backgroundColor: colors.steelBlue }]}>
            <Feather name="info" size={16} color={colors.secondary} />
          </View>
          <Text style={[styles.tipText, { color: colors.secondary, fontSize: 15 }]}>{tip}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  stepNumberContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  titleBlock: {
    flex: 1,
    paddingTop: 4,
  },
  title: {
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
  },
  imageContainer: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
  },
  imageFrame: {
    width: "100%",
    height: 210,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(48,82,160,0.15)",
  },
  imageLabelBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageLabelText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
  },
  description: {
    fontFamily: "Inter_400Regular",
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 14,
    padding: 13,
    marginTop: 12,
    gap: 10,
  },
  tipIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  tipText: {
    fontFamily: "Inter_400Regular",
    flex: 1,
    lineHeight: 23,
  },
});
