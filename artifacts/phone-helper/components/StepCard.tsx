import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

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
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.97)).current;
  const fadeAnim = useRef(new Animated.Value(isActive ? 1 : 0.6)).current;
  const rotateX = useRef(new Animated.Value(isActive ? 0 : 3)).current;
  const imageReveal = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.88)).current;
  const translateZ = useRef(new Animated.Value(isActive ? 8 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.97,
        tension: 70,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: isActive ? 1 : isCompleted ? 0.8 : 0.55,
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
          duration: 480,
          delay: 120,
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          tension: 55,
          friction: 8,
          delay: 120,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      imageReveal.setValue(0);
      imageScale.setValue(0.88);
    }
  }, [isActive, isCompleted]);

  const s = styles(colors, isActive, isCompleted);

  return (
    <Animated.View
      style={[
        s.card,
        {
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
      <View style={s.headerRow}>
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
        </View>
        <View style={s.titleBlock}>
          <Text style={s.title}>{title}</Text>
        </View>
      </View>

      {isActive && image && (
        <Animated.View
          style={[
            s.imageContainer,
            {
              opacity: imageReveal,
              transform: [
                { perspective: 1000 },
                { scale: imageScale },
                {
                  translateY: imageReveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={s.imageFrame}>
            <Image
              source={image}
              style={s.image}
              resizeMode="cover"
            />
            <View style={s.imageOverlayGradient} />
            <View style={s.imageLabelBadge}>
              <Feather name="eye" size={12} color="#ffffff" />
              <Text style={s.imageLabelText}>What it looks like</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <Text style={s.description}>{description}</Text>

      {tip && isActive && (
        <View style={s.tipBox}>
          <View style={s.tipIconBox}>
            <Feather name="info" size={15} color={colors.secondary} />
          </View>
          <Text style={s.tipText}>{tip}</Text>
        </View>
      )}
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
      marginBottom: 10,
      padding: isActive ? 18 : 14,
      borderRadius: 20,
      backgroundColor: isActive
        ? "#ffffff"
        : isCompleted
        ? colors.lavender
        : "transparent",
      borderWidth: isActive ? 2.5 : 0,
      borderColor: isActive ? colors.primary : "transparent",
      shadowColor: isActive ? colors.primary : "transparent",
      shadowOffset: { width: 0, height: isActive ? 8 : 0 },
      shadowOpacity: isActive ? 0.2 : 0,
      shadowRadius: isActive ? 16 : 0,
      elevation: isActive ? 6 : 0,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: isActive ? 10 : 4,
    },
    stepNumberContainer: {
      marginRight: 14,
      marginTop: 2,
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
      fontSize: 17,
      fontFamily: "Inter_700Bold",
      color: colors.mutedForeground,
    },
    stepNumberActive: {
      color: "#ffffff",
    },
    titleBlock: {
      flex: 1,
      paddingTop: 4,
    },
    title: {
      fontSize: isActive ? 20 : 17,
      fontFamily: "Inter_600SemiBold",
      color: isActive
        ? colors.primary
        : isCompleted
        ? colors.muted
        : colors.foreground,
      lineHeight: 26,
    },
    imageContainer: {
      marginBottom: 14,
      borderRadius: 16,
      overflow: "hidden",
    },
    imageFrame: {
      width: "100%",
      height: 200,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      backgroundColor: colors.steelBlue,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 16,
    },
    imageOverlayGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 48,
      backgroundColor: "rgba(61,82,160,0.18)",
    },
    imageLabelBadge: {
      position: "absolute",
      bottom: 10,
      right: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "rgba(61,82,160,0.75)",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    imageLabelText: {
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      color: "#ffffff",
    },
    description: {
      fontSize: isActive ? 17 : 15,
      fontFamily: "Inter_400Regular",
      color: isActive ? colors.foreground : colors.mutedForeground,
      lineHeight: isActive ? 28 : 22,
      marginLeft: 50,
    },
    tipBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.lavender,
      borderRadius: 12,
      padding: 12,
      marginTop: 12,
      marginLeft: 50,
      gap: 8,
    },
    tipIconBox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.steelBlue,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 1,
    },
    tipText: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: colors.secondary,
      flex: 1,
      lineHeight: 21,
    },
  });
