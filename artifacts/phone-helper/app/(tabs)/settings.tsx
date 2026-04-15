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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp, DeviceType } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType, setDeviceType, setHasCompletedOnboarding, tutorialProgress, referralCode, referralCount, incrementReferralCount } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const referralCardScale = useRef(new Animated.Value(0.94)).current;
  const referralCardOpacity = useRef(new Animated.Value(0)).current;
  const [copied, setCopied] = useState(false);

  const referralLink = `https://phonebuddy.app/join?ref=${referralCode}`;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(referralCardScale, { toValue: 1, tension: 60, friction: 8, delay: 200, useNativeDriver: true }),
      Animated.timing(referralCardOpacity, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
    ]).start();
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

  async function handleShare() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    incrementReferralCount();
    try {
      const message = `👋 I found a great free app called PhoneBuddy that teaches you how to use your smartphone with easy step-by-step guides! Download it here:\n\n${referralLink}`;
      await Share.share({
        message,
        url: referralLink,
        title: "PhoneBuddy — Your Friendly Phone Guide",
      });
    } catch (e) {
      // user cancelled, that's fine
    }
  }

  async function handleShareWhatsApp() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    incrementReferralCount();
    const message = encodeURIComponent(
      `👋 I found a great free app called PhoneBuddy that teaches you how to use your smartphone with easy step-by-step guides!\n\nDownload it here: ${referralLink}`
    );
    const url = `whatsapp://send?text=${message}`;
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      handleShare();
    }
  }

  async function handleShareSMS() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    incrementReferralCount();
    const message = encodeURIComponent(
      `Check out PhoneBuddy — a free app that teaches you to use your smartphone step by step! ${referralLink}`
    );
    const url = Platform.OS === "ios" ? `sms:&body=${message}` : `sms:?body=${message}`;
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      handleShare();
    }
  }

  function handleCopyCode() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Clipboard.setString(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

      <Animated.View
        style={[
          s.referralCard,
          {
            opacity: referralCardOpacity,
            transform: [{ scale: referralCardScale }],
          },
        ]}
      >
        <View style={s.referralHeader}>
          <View style={s.referralIconBox}>
            <Feather name="gift" size={24} color="#ffffff" />
          </View>
          <View style={s.referralHeaderText}>
            <Text style={s.referralTitle}>Invite a Friend</Text>
            <Text style={s.referralSubtitle}>Share PhoneBuddy with someone who needs help</Text>
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
            <Feather name={copied ? "check" : "copy"} size={16} color={copied ? "#ffffff" : colors.primary} />
            <Text style={[s.copyButtonText, copied && s.copyButtonTextDone]}>
              {copied ? "Copied!" : "Copy"}
            </Text>
          </TouchableOpacity>
        </View>

        {referralCount > 0 && (
          <View style={s.referralCountRow}>
            <Feather name="users" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={s.referralCountText}>
              You have shared PhoneBuddy {referralCount} {referralCount === 1 ? "time" : "times"} — thank you!
            </Text>
          </View>
        )}

        <Text style={s.shareLabel}>Share via</Text>
        <View style={s.shareButtons}>
          <TouchableOpacity style={[s.shareButton, s.whatsappButton]} onPress={handleShareWhatsApp} activeOpacity={0.85}>
            <Feather name="message-circle" size={20} color="#ffffff" />
            <Text style={s.shareButtonText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareButton, s.smsButton]} onPress={handleShareSMS} activeOpacity={0.85}>
            <Feather name="message-square" size={20} color="#ffffff" />
            <Text style={s.shareButtonText}>SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.shareButton, s.moreButton]} onPress={handleShare} activeOpacity={0.85}>
            <Feather name="share-2" size={20} color={colors.primary} />
            <Text style={[s.shareButtonText, { color: colors.primary }]}>More</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

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
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statNumber}>{referralCount}</Text>
            <Text style={s.statLabel}>Friends{"\n"}Invited</Text>
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
        <Text style={s.sectionTitle}>About PhoneBuddy</Text>
        <View style={s.infoCard}>
          <Feather name="info" size={22} color={colors.secondary} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={s.infoTitle}>PhoneBuddy</Text>
            <Text style={s.infoText}>
              Designed to help you learn how to use your smartphone with easy, friendly step-by-step guides. Made with care for everyone.
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
      marginBottom: 22,
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
    referralCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 22,
      marginBottom: 20,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 12,
    },
    referralHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
      gap: 14,
    },
    referralIconBox: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: "rgba(255,255,255,0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    referralHeaderText: {
      flex: 1,
    },
    referralTitle: {
      fontSize: 21,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      marginBottom: 2,
    },
    referralSubtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.78)",
      lineHeight: 19,
    },
    referralCodeBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 16,
      padding: 14,
      marginBottom: 14,
    },
    referralCodeLeft: {
      flex: 1,
    },
    referralCodeLabel: {
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      color: "rgba(255,255,255,0.65)",
      marginBottom: 3,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    referralCodeText: {
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      letterSpacing: 3,
    },
    copyButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#ffffff",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    copyButtonDone: {
      backgroundColor: colors.success,
    },
    copyButtonText: {
      fontSize: 14,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
    },
    copyButtonTextDone: {
      color: "#ffffff",
    },
    referralCountRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    referralCountText: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: "rgba(255,255,255,0.8)",
      flex: 1,
    },
    shareLabel: {
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      color: "rgba(255,255,255,0.7)",
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    shareButtons: {
      flexDirection: "row",
      gap: 10,
    },
    shareButton: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 16,
      paddingVertical: 14,
    },
    whatsappButton: {
      backgroundColor: "#25D366",
    },
    smsButton: {
      backgroundColor: colors.secondary,
    },
    moreButton: {
      backgroundColor: "#ffffff",
    },
    shareButtonText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: "#ffffff",
    },
    statsCard: {
      backgroundColor: "#ffffff",
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    statsTitle: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
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
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 18,
    },
    statDivider: {
      width: 1,
      height: 56,
      backgroundColor: colors.steelBlue,
      marginHorizontal: 12,
    },
    section: {
      marginBottom: 22,
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
