import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp, DeviceType } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType, setDeviceType, setHasCompletedOnboarding, tutorialProgress } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  function handleChangeDevice(device: DeviceType) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDeviceType(device);
  }

  function handleResetProgress() {
    Alert.alert(
      "Reset Progress",
      "This will clear all your tutorial progress. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            setHasCompletedOnboarding(false);
          },
        },
      ]
    );
  }

  const completedTutorials = Object.keys(tutorialProgress).filter(
    (k) => tutorialProgress[k] > 0
  ).length;

  const s = styles(colors, insets);

  return (
    <Animated.ScrollView
      style={[s.container, { opacity: fadeAnim }]}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={s.title}>Settings</Text>
        <Text style={s.subtitle}>Adjust your preferences</Text>
      </View>

      <View style={s.statsCard}>
        <Text style={s.statsTitle}>Your Progress</Text>
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNumber}>{completedTutorials}</Text>
            <Text style={s.statLabel}>Tutorials{"\n"}Started</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statNumber}>{Object.values(tutorialProgress).reduce((a, b) => a + b, 0)}</Text>
            <Text style={s.statLabel}>Steps{"\n"}Completed</Text>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>My Device</Text>
        <Text style={s.sectionSubtitle}>
          Choose which type of phone you are using so we show you the right instructions
        </Text>
        <View style={s.deviceButtons}>
          <TouchableOpacity
            style={[
              s.deviceButton,
              deviceType === "android" && s.deviceButtonActive,
            ]}
            onPress={() => handleChangeDevice("android")}
            activeOpacity={0.85}
          >
            <Feather
              name="cpu"
              size={26}
              color={deviceType === "android" ? "#ffffff" : colors.primary}
            />
            <Text
              style={[
                s.deviceButtonText,
                deviceType === "android" && s.deviceButtonTextActive,
              ]}
            >
              Android
            </Text>
            {deviceType === "android" && (
              <Feather name="check-circle" size={18} color="#ffffff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              s.deviceButton,
              deviceType === "apple" && s.deviceButtonActive,
            ]}
            onPress={() => handleChangeDevice("apple")}
            activeOpacity={0.85}
          >
            <Feather
              name="monitor"
              size={26}
              color={deviceType === "apple" ? "#ffffff" : colors.primary}
            />
            <Text
              style={[
                s.deviceButtonText,
                deviceType === "apple" && s.deviceButtonTextActive,
              ]}
            >
              iPhone
            </Text>
            {deviceType === "apple" && (
              <Feather name="check-circle" size={18} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Help & Information</Text>
        <View style={s.infoCard}>
          <Feather name="info" size={22} color={colors.secondary} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={s.infoTitle}>Phone Helper</Text>
            <Text style={s.infoText}>
              This app is designed to help you learn how to use your smartphone with easy, friendly step-by-step guides.
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={s.resetButton} onPress={handleResetProgress} activeOpacity={0.85}>
        <Feather name="refresh-ccw" size={18} color={colors.destructive} />
        <Text style={s.resetButtonText}>Reset My Progress</Text>
      </TouchableOpacity>
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
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    statsCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    statsTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: "rgba(255,255,255,0.8)",
      marginBottom: 16,
    },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statNumber: {
      fontSize: 40,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.75)",
      textAlign: "center",
      lineHeight: 20,
    },
    statDivider: {
      width: 1,
      height: 60,
      backgroundColor: "rgba(255,255,255,0.25)",
      marginHorizontal: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 22,
      marginBottom: 14,
    },
    deviceButtons: {
      flexDirection: "row",
      gap: 12,
    },
    deviceButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "#ffffff",
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 12,
      borderWidth: 2,
      borderColor: colors.steelBlue,
      minHeight: 60,
    },
    deviceButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    deviceButtonText: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    deviceButtonTextActive: {
      color: "#ffffff",
    },
    infoCard: {
      backgroundColor: "#ffffff",
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    infoTitle: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
    },
    infoText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      lineHeight: 22,
    },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: 18,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.destructive,
      backgroundColor: "transparent",
      minHeight: 60,
    },
    resetButtonText: {
      fontSize: 17,
      fontFamily: "Inter_600SemiBold",
      color: colors.destructive,
    },
  });
