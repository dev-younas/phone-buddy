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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const androidAnim = useRef(new Animated.Value(0)).current;
  const appleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.stagger(120, [
          Animated.spring(androidAnim, {
            toValue: 1,
            tension: 70,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(appleAnim, {
            toValue: 1,
            tension: 70,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
      androidAnim.setValue(0);
      appleAnim.setValue(0);
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
      <Animated.View style={[s(colors).overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            s(colors).card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={s(colors).headerContainer}>
            <View style={s(colors).iconCircle}>
              <Feather name="smartphone" size={32} color={colors.primary} />
            </View>
            <Text style={s(colors).title}>What type of phone do you have?</Text>
            <Text style={s(colors).subtitle}>
              We will customize your experience to match your device
            </Text>
          </View>

          <View style={s(colors).buttonsRow}>
            <Animated.View
              style={{
                flex: 1,
                opacity: androidAnim,
                transform: [
                  {
                    translateY: androidAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
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
                  {
                    translateY: appleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
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

          <Text style={s(colors).footnote}>
            You can change this later in Settings
          </Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(61,82,160,0.55)",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    card: {
      backgroundColor: colors.lavender,
      borderRadius: 28,
      padding: 28,
      width: "100%",
      maxWidth: 420,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 16,
    },
    headerContainer: {
      alignItems: "center",
      marginBottom: 28,
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.steelBlue,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
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
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
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
      width: 72,
      height: 72,
      borderRadius: 36,
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
      color: "rgba(255,255,255,0.8)",
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
