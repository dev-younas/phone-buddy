import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import * as Haptics from "expo-haptics";

interface DeviceModalProps {
  visible: boolean;
  onSelect: (device: "android" | "apple") => void;
}

export function DeviceModal({ visible, onSelect }: DeviceModalProps) {
  const colors = useColors();

  const overlayFade = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.6)).current;
  const cardRotateX = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const androidAnim = useRef(new Animated.Value(0)).current;
  const appleAnim = useRef(new Animated.Value(0)).current;
  const androidRotateY = useRef(new Animated.Value(-25)).current;
  const appleRotateY = useRef(new Animated.Value(25)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(overlayFade, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.parallel([
          Animated.spring(cardScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
          Animated.timing(cardOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.spring(cardRotateX, { toValue: 0, tension: 55, friction: 9, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(titleOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.spring(titleSlide, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
        ]),
        Animated.stagger(150, [
          Animated.parallel([
            Animated.spring(androidAnim, { toValue: 1, tension: 65, friction: 7, useNativeDriver: true }),
            Animated.spring(androidRotateY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.spring(appleAnim, { toValue: 1, tension: 65, friction: 7, useNativeDriver: true }),
            Animated.spring(appleRotateY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
          ]),
        ]),
        Animated.timing(footerOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      overlayFade.setValue(0);
      cardScale.setValue(0.6);
      cardRotateX.setValue(1);
      cardOpacity.setValue(0);
      titleSlide.setValue(-20);
      titleOpacity.setValue(0);
      androidAnim.setValue(0);
      appleAnim.setValue(0);
      androidRotateY.setValue(-25);
      appleRotateY.setValue(25);
      footerOpacity.setValue(0);
    }
  }, [visible]);

  function handleSelect(device: "android" | "apple") {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSelect(device);
  }

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[s(colors).overlay, { opacity: overlayFade }]}>
        <Animated.View
          style={[
            s(colors).card,
            {
              opacity: cardOpacity,
              transform: [
                { perspective: 1200 },
                { scale: cardScale },
                {
                  rotateX: cardRotateX.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "20deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              s(colors).headerContainer,
              { opacity: titleOpacity, transform: [{ translateY: titleSlide }] },
            ]}
          >
            <View style={s(colors).iconCircle}>
              <Feather name="smartphone" size={32} color={colors.primary} />
            </View>
            <Text style={s(colors).title}>What type of phone do you have?</Text>
            <Text style={s(colors).subtitle}>
              We will customize your experience to match your device
            </Text>
          </Animated.View>

          <View style={s(colors).buttonsRow}>
            <Animated.View
              style={{
                flex: 1,
                opacity: androidAnim,
                transform: [
                  { perspective: 900 },
                  {
                    rotateY: androidRotateY.interpolate({
                      inputRange: [-30, 0],
                      outputRange: ["-30deg", "0deg"],
                    }),
                  },
                  {
                    scale: androidAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[s(colors).deviceButton, s(colors).androidButton]}
                onPress={() => handleSelect("android")}
                activeOpacity={0.82}
              >
                <View style={s(colors).deviceIconBox}>
                  <Feather name="cpu" size={40} color="#ffffff" />
                </View>
                <Text style={s(colors).deviceLabel}>Android</Text>
                <Text style={s(colors).deviceSubLabel}>Samsung, Pixel{"\n"}and more</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={{
                flex: 1,
                opacity: appleAnim,
                transform: [
                  { perspective: 900 },
                  {
                    rotateY: appleRotateY.interpolate({
                      inputRange: [0, 30],
                      outputRange: ["0deg", "30deg"],
                    }),
                  },
                  {
                    scale: appleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[s(colors).deviceButton, s(colors).appleButton]}
                onPress={() => handleSelect("apple")}
                activeOpacity={0.82}
              >
                <View style={s(colors).deviceIconBox}>
                  <Feather name="monitor" size={40} color="#ffffff" />
                </View>
                <Text style={s(colors).deviceLabel}>iPhone</Text>
                <Text style={s(colors).deviceSubLabel}>Apple iPhone{"\n"}any model</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Animated.Text style={[s(colors).footnote, { opacity: footerOpacity }]}>
            You can change this later in Settings
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(61,82,160,0.6)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: colors.lavender,
      borderRadius: 30,
      padding: 28,
      width: "100%",
      maxWidth: 420,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.3,
      shadowRadius: 28,
      elevation: 18,
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 28,
    },
    iconCircle: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: colors.steelBlue,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 4,
    },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 24,
    },
    buttonsRow: {
      flexDirection: "row",
      gap: 14,
      marginBottom: 20,
    },
    deviceButton: {
      borderRadius: 22,
      padding: 20,
      alignItems: "center",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 10,
    },
    androidButton: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
    },
    appleButton: {
      backgroundColor: colors.secondary,
      shadowColor: colors.secondary,
    },
    deviceIconBox: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    deviceLabel: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      marginBottom: 4,
    },
    deviceSubLabel: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.82)",
      textAlign: "center",
      lineHeight: 19,
    },
    footnote: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
    },
  });
