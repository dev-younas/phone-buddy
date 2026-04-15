import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { tutorials } from "@/data/tutorials";
import { StepCard } from "@/components/StepCard";
import * as Haptics from "expo-haptics";

export default function TutorialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType, tutorialProgress, setTutorialProgress } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const tutorial = tutorials.find((t) => t.id === id);
  const isAndroid = deviceType === "android";
  const steps = tutorial ? (isAndroid ? tutorial.androidSteps : tutorial.appleSteps) : [];

  const savedStep = tutorial ? (tutorialProgress[tutorial.id] ?? 0) : 0;
  const [currentStep, setCurrentStep] = useState(savedStep);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (steps.length > 0) {
      Animated.timing(progressAnim, {
        toValue: currentStep / steps.length,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [currentStep, steps.length]);

  if (!tutorial) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Tutorial not found</Text>
      </View>
    );
  }

  function handleNext() {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setTutorialProgress(tutorial!.id, nextStep);
  }

  function handleBack() {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setTutorialProgress(tutorial!.id, prevStep);
    } else {
      router.back();
    }
  }

  function handleFinish() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setTutorialProgress(tutorial!.id, steps.length);
    router.back();
  }

  const isLastStep = currentStep === steps.length - 1;
  const isComplete = currentStep >= steps.length;

  const s = styles(colors, insets);

  if (isComplete) {
    return (
      <Animated.View style={[s.container, { opacity: fadeAnim }]}>
        <View style={s.completeContainer}>
          <View style={s.completeIcon}>
            <Feather name="check-circle" size={80} color={colors.success} />
          </View>
          <Text style={s.completeTitle}>Well done!</Text>
          <Text style={s.completeText}>
            You have completed the {tutorial.title} tutorial. You are doing great!
          </Text>
          <TouchableOpacity
            style={[s.button, { backgroundColor: colors.success }]}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Feather name="arrow-left" size={22} color="#ffffff" />
            <Text style={s.buttonText}>Back to Tutorials</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.restartButton}
            onPress={() => {
              setCurrentStep(0);
              setTutorialProgress(tutorial.id, 0);
            }}
            activeOpacity={0.85}
          >
            <Text style={s.restartButtonText}>Review Again</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[s.container, { opacity: fadeAnim }]}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={handleBack} style={s.backButton} activeOpacity={0.8}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={s.progressContainer}>
          <Animated.View
            style={[
              s.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={s.stepCounter}>
          {currentStep + 1}/{steps.length}
        </Text>
      </View>

      <View style={s.titleContainer}>
        <Text style={s.tutorialTitle}>{tutorial.title}</Text>
        <Text style={s.tutorialPlatform}>
          {isAndroid ? "Android steps" : "iPhone steps"}
        </Text>
      </View>

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step, index) => (
          <StepCard
            key={index}
            stepNumber={index + 1}
            title={step.title}
            description={step.description}
            tip={step.tip}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
          />
        ))}
      </ScrollView>

      <View style={s.footer}>
        {isLastStep ? (
          <TouchableOpacity
            style={[s.button, { backgroundColor: colors.success }]}
            onPress={handleFinish}
            activeOpacity={0.85}
          >
            <Text style={s.buttonText}>I'm Done!</Text>
            <Feather name="check-circle" size={22} color="#ffffff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={s.button}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={s.buttonText}>I've Done This Step</Text>
            <Feather name="arrow-right" size={22} color="#ffffff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleBack} style={s.backTextButton} activeOpacity={0.8}>
          <Text style={s.backText}>
            {currentStep === 0 ? "Back to Tutorials" : "Previous Step"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = (colors: ReturnType<typeof useColors>, insets: ReturnType<typeof useSafeAreaInsets>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.lavender,
      paddingTop: Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    progressContainer: {
      flex: 1,
      height: 8,
      backgroundColor: colors.steelBlue,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    stepCounter: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
      color: colors.primary,
      minWidth: 40,
      textAlign: "right",
    },
    titleContainer: {
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    tutorialTitle: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      marginBottom: 2,
    },
    tutorialPlatform: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16,
      paddingTop: 12,
      backgroundColor: colors.lavender,
      gap: 10,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingVertical: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 64,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    buttonText: {
      fontSize: 19,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    backTextButton: {
      alignItems: "center",
      paddingVertical: 10,
    },
    backText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
    completeContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      gap: 16,
    },
    completeIcon: {
      marginBottom: 8,
    },
    completeTitle: {
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    completeText: {
      fontSize: 18,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 28,
    },
    restartButton: {
      paddingVertical: 12,
    },
    restartButtonText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      color: colors.mutedForeground,
    },
  });
