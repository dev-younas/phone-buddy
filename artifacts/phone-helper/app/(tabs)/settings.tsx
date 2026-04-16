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
  Share,
  Linking,
  Clipboard,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp, DeviceType } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    deviceType, setDeviceType, setHasCompletedOnboarding,
    tutorialProgress, referralCode, referralCount, incrementReferralCount,
    isDarkMode, setIsDarkMode,
  } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const referralCardScale = useRef(new Animated.Value(0.92)).current;
  const referralCardOpacity = useRef(new Animated.Value(0)).current;
  const darkToggleScale = useRef(new Animated.Value(1)).current;
  const [copied, setCopied] = useState(false);

  const referralLink = `https://phonebuddy.app/join?ref=${referralCode}`;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(referralCardScale, { toValue: 1, tension: 58, friction: 8, delay: 150, useNativeDriver: true }),
      Animated.timing(referralCardOpacity, { toValue: 1, duration: 400, delay: 150, useNativeDriver: true }),
    ]).start();
  }, []);

  function handleChangeDevice(device: DeviceType) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDeviceType(device);
  }

  function handleToggleDark(v: boolean) {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.spring(darkToggleScale, { toValue: 0.92, tension: 200, friction: 5, useNativeDriver: true }),
      Animated.spring(darkToggleScale, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();
    setIsDarkMode(v);
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

  async function handleShare() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    incrementReferralCount();
    try {
      const message = `👋 I found a great free app called PhoneBuddy that teaches you how to use your smartphone with easy step-by-step guides!\n\n${referralLink}`;
      await Share.share({ message, url: referralLink, title: "PhoneBuddy — Your Friendly Phone Guide" });
    } catch (e) {}
  }

  async function handleShareWhatsApp() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    incrementReferralCount();
    const message = encodeURIComponent(
      `👋 I found a great free app called PhoneBuddy that teaches you how to use your smartphone step by step!\n\n${referralLink}`
    );
    const url = `whatsapp://send?text=${message}`;
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    canOpen ? Linking.openURL(url) : handleShare();
  }

  async function handleShareSMS() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    incrementReferralCount();
    const message = encodeURIComponent(`Check out PhoneBuddy — free app, step-by-step phone guides! ${referralLink}`);
    const url = Platform.OS === "ios" ? `sms:&body=${message}` : `sms:?body=${message}`;
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    canOpen ? Linking.openURL(url) : handleShare();
  }

  function handleCopyCode() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Clipboard.setString(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const completedTutorials = Object.keys(tutorialProgress).filter((k) => tutorialProgress[k] > 0).length;
  const totalSteps = Object.values(tutorialProgress).reduce((a, b) => a + b, 0);
  const s = styles(colors, insets);

  return (
    <Animated.ScrollView
      style={[s.container, { opacity: fadeAnim }]}
      contentContainerStyle={s.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.header}>
        <Text style={s.title}>Settings</Text>
        <Text style={s.subtitle}>Your preferences and account</Text>
      </View>

      <Animated.View
        style={{
          opacity: darkToggleScale.interpolate({ inputRange: [0.92, 1], outputRange: [0.8, 1] }),
          transform: [{ scale: darkToggleScale }],
        }}
      >
        <View style={[s.themeCard, { backgroundColor: isDarkMode ? colors.card : "#FFFFFF" }]}>
          <View style={s.themeLeft}>
            <View style={[s.themeIconBox, { backgroundColor: isDarkMode ? "#1A2C5A" : "#F0EBF8" }]}>
              <Feather
                name={isDarkMode ? "moon" : "sun"}
                size={26}
                color={isDarkMode ? "#7EB3FF" : "#F5A623"}
              />
            </View>
            <View style={s.themeText}>
              <Text style={[s.themeTitle, { color: colors.foreground }]}>
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </Text>
              <Text style={[s.themeSubtitle, { color: colors.mutedForeground }]}>
                {isDarkMode ? "Navy blue — easier on the eyes at night" : "Warm cream — bright and cheerful"}
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleDark}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          s.referralCard,
          { opacity: referralCardOpacity, transform: [{ scale: referralCardScale }] },
        ]}
      >
        <View style={s.referralHeader}>
          <View style={s.referralIconBox}>
            <Text style={{ fontSize: 26 }}>🎁</Text>
          </View>
          <View style={s.referralHeaderText}>
            <Text style={s.referralTitle}>Invite a Friend</Text>
            <Text style={s.referralSubtitle}>Share PhoneBuddy — it's free and helpful!</Text>
          </View>
        </View>

        <View style={s.referralCodeBox}>
          <View style={s.referralCodeLeft}>
            <Text style={s.referralCodeLabel}>Your referral code</Text>
            <Text style={s.referralCodeText}>{referralCode}</Text>
          </View>
          <TouchableOpacity
            style={[s.copyButton, copied && s.copyButtonDone]}
            onPress={handleCopyCode}
            activeOpacity={0.8}
          >
            <Feather name={copied ? "check" : "copy"} size={17} color={copied ? "#ffffff" : colors.primary} />
            <Text style={[s.copyButtonText, copied && s.copyButtonTextDone]}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </TouchableOpacity>
        </View>

        {referralCount > 0 && (
          <View style={s.referralCountRow}>
            <Text style={s.referralCountText}>
              🎉 You've shared PhoneBuddy {referralCount} {referralCount === 1 ? "time" : "times"} — thank you!
            </Text>
          </View>
        )}

        <Text style={s.shareLabel}>Share via</Text>
        <View style={s.shareButtons}>
          <TouchableOpacity style={[s.shareButton, { backgroundColor: "#25D366" }]} onPress={handleShareWhatsApp} activeOpacity={0.85}>
            <Feather name="message-circle" size={22} color="#ffffff" />
            <Text style={s.shareButtonText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareButton, { backgroundColor: colors.secondary }]} onPress={handleShareSMS} activeOpacity={0.85}>
            <Feather name="message-square" size={22} color="#ffffff" />
            <Text style={s.shareButtonText}>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.shareButton, { backgroundColor: isDarkMode ? colors.muted : "#F0EBF8" }]}
            onPress={handleShare}
            activeOpacity={0.85}
          >
            <Feather name="share-2" size={22} color={colors.primary} />
            <Text style={[s.shareButtonText, { color: colors.primary }]}>More</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={[s.statsCard, { backgroundColor: isDarkMode ? colors.card : "#FFFFFF" }]}>
        <Text style={[s.statsTitle, { color: colors.foreground }]}>Your Progress</Text>
        <View style={s.statsRow}>
          {[
            { value: completedTutorials, label: "Tutorials\nStarted" },
            { value: totalSteps, label: "Steps\nCompleted" },
            { value: referralCount, label: "Friends\nInvited" },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={[s.statDivider, { backgroundColor: colors.muted }]} />}
              <View style={s.statItem}>
                <Text style={[s.statNumber, { color: colors.primary }]}>{item.value}</Text>
                <Text style={[s.statLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      <View style={s.section}>
        <Text style={[s.sectionTitle, { color: colors.foreground }]}>My Device</Text>
        <Text style={[s.sectionSubtitle, { color: colors.mutedForeground }]}>
          Choose your phone type so we show you the right instructions
        </Text>
        <View style={s.deviceButtons}>
          {(["android", "apple"] as DeviceType[]).map((device) => (
            <TouchableOpacity
              key={device}
              style={[
                s.deviceButton,
                { backgroundColor: isDarkMode ? colors.card : "#FFFFFF", borderColor: colors.muted },
                deviceType === device && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => handleChangeDevice(device)}
              activeOpacity={0.85}
            >
              <Feather
                name={device === "android" ? "cpu" : "monitor"}
                size={28}
                color={deviceType === device ? "#ffffff" : colors.primary}
              />
              <Text
                style={[s.deviceButtonText, { color: deviceType === device ? "#ffffff" : colors.primary }]}
              >
                {device === "android" ? "Android" : "iPhone"}
              </Text>
              {deviceType === device && <Feather name="check-circle" size={20} color="#ffffff" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[s.infoCard, { backgroundColor: isDarkMode ? colors.card : "#FFFFFF", borderColor: colors.muted }]}>
        <Text style={{ fontSize: 28 }}>📱</Text>
        <View style={{ flex: 1 }}>
          <Text style={[s.infoTitle, { color: colors.foreground }]}>About PhoneBuddy</Text>
          <Text style={[s.infoText, { color: colors.mutedForeground }]}>
            Designed to help you learn how to use your smartphone with friendly, jargon-free guides. Made with care — just for you!
          </Text>
        </View>
      </View>

      <TouchableOpacity style={[s.resetButton, { borderColor: colors.destructive }]} onPress={handleResetProgress} activeOpacity={0.85}>
        <Feather name="refresh-ccw" size={20} color={colors.destructive} />
        <Text style={[s.resetButtonText, { color: colors.destructive }]}>Reset My Progress</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: {
      paddingTop: Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top + 16,
      paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 110,
      paddingHorizontal: 20,
    },
    header: { marginBottom: 20 },
    title: { fontSize: 40, fontFamily: "Inter_700Bold", color: colors.primary, marginBottom: 6 },
    subtitle: { fontSize: 20, fontFamily: "Inter_400Regular", color: colors.mutedForeground },
    themeCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 22,
      padding: 18,
      marginBottom: 18,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    themeLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 14 },
    themeIconBox: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: "center",
      justifyContent: "center",
    },
    themeText: { flex: 1 },
    themeTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 4 },
    themeSubtitle: { fontSize: 17, fontFamily: "Inter_400Regular", lineHeight: 25 },
    referralCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 22,
      marginBottom: 18,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 12,
    },
    referralHeader: { flexDirection: "row", alignItems: "center", marginBottom: 18, gap: 14 },
    referralIconBox: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    referralHeaderText: { flex: 1 },
    referralTitle: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#ffffff", marginBottom: 4 },
    referralSubtitle: { fontSize: 18, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.78)", lineHeight: 28 },
    referralCodeBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 16,
      padding: 14,
      marginBottom: 14,
    },
    referralCodeLeft: { flex: 1 },
    referralCodeLabel: {
      fontSize: 12,
      fontFamily: "Inter_500Medium",
      color: "rgba(255,255,255,0.65)",
      marginBottom: 3,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    referralCodeText: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#ffffff", letterSpacing: 3 },
    copyButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#ffffff",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    copyButtonDone: { backgroundColor: colors.success },
    copyButtonText: { fontSize: 17, fontFamily: "Inter_600SemiBold", color: colors.primary },
    copyButtonTextDone: { color: "#ffffff" },
    referralCountRow: { marginBottom: 14 },
    referralCountText: { fontSize: 18, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.85)" },
    shareLabel: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "rgba(255,255,255,0.7)",
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    shareButtons: { flexDirection: "row", gap: 10 },
    shareButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      borderRadius: 16,
      paddingVertical: 14,
    },
    shareButtonText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#ffffff" },
    statsCard: {
      borderRadius: 22,
      padding: 22,
      marginBottom: 18,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    statsTitle: { fontSize: 22, fontFamily: "Inter_600SemiBold", marginBottom: 16 },
    statsRow: { flexDirection: "row", alignItems: "center" },
    statItem: { flex: 1, alignItems: "center" },
    statNumber: { fontSize: 46, fontFamily: "Inter_700Bold", marginBottom: 4 },
    statLabel: { fontSize: 16, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
    statDivider: { width: 1, height: 58, marginHorizontal: 10 },
    section: { marginBottom: 18 },
    sectionTitle: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 8 },
    sectionSubtitle: { fontSize: 19, fontFamily: "Inter_400Regular", lineHeight: 29, marginBottom: 14 },
    deviceButtons: { flexDirection: "row", gap: 12 },
    deviceButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      borderRadius: 18,
      paddingVertical: 20,
      paddingHorizontal: 12,
      borderWidth: 2,
      minHeight: 66,
    },
    deviceButtonText: { fontSize: 22, fontFamily: "Inter_700Bold" },
    infoCard: {
      borderRadius: 18,
      padding: 18,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 14,
      marginBottom: 18,
      borderWidth: 1,
    },
    infoTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 6 },
    infoText: { fontSize: 18, fontFamily: "Inter_400Regular", lineHeight: 28 },
    resetButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      padding: 20,
      borderRadius: 18,
      borderWidth: 2,
      backgroundColor: "transparent",
      minHeight: 66,
    },
    resetButtonText: { fontSize: 22, fontFamily: "Inter_600SemiBold" },
  });
