import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { tutorials } from "@/data/tutorials";
import { StepCard } from "@/components/StepCard";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function TutorialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType, tutorialProgress, setTutorialProgress } = useApp();

  const tutorial = tutorials.find((t) => t.id === id);
  const isAndroid = deviceType === "android";
  const steps = tutorial ? (isAndroid ? tutorial.androidSteps : tutorial.appleSteps) : [];

  const savedStep = tutorial ? (tutorialProgress[tutorial.id] ?? 0) : 0;
  const initialStep = savedStep >= steps.length ? 0 : savedStep;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showComplete, setShowComplete] = useState(
    savedStep >= steps.length && steps.length > 0
  );

  const masterFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const stepTranslate = useRef(new Animated.Value(0)).current;
  const stepOpacity = useRef(new Animated.Value(1)).current;
  const buttonBounce = useRef(new Animated.Value(1)).current;
  const completePop = useRef(new Animated.Value(0)).current;
  const completeRotate = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(masterFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (steps.length > 0 && !showComplete) {
      Animated.timing(progressAnim, {
        toValue: (currentStep + 1) / steps.length,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [currentStep, steps.length, showComplete]);

  useEffect(() => {
    if (showComplete) {
      Animated.parallel([
        Animated.spring(completePop, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
        Animated.timing(completeRotate, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start();
    }
  }, [showComplete]);

  const animateStepTransition = useCallback((direction: "forward" | "back", callback: () => void) => {
    const outX = direction === "forward" ? -width * 0.25 : width * 0.25;
    const inX = direction === "forward" ? width * 0.25 : -width * 0.25;

    Animated.parallel([
      Animated.timing(stepTranslate, { toValue: outX, duration: 200, useNativeDriver: true }),
      Animated.timing(stepOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      stepTranslate.setValue(inX);
      callback();
      Animated.parallel([
        Animated.spring(stepTranslate, { toValue: 0, tension: 65, friction: 8, useNativeDriver: true }),
        Animated.timing(stepOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  }, []);

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
    Animated.sequence([
      Animated.timing(buttonBounce, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.spring(buttonBounce, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();
    animateStepTransition("forward", () => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTutorialProgress(tutorial!.id, nextStep);
    });
  }

  function handleBack() {
    if (currentStep > 0) {
      if (Platform.OS !== "web") {
        Haptics.selectionAsync();
      }
      animateStepTransition("back", () => {
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        setTutorialProgress(tutorial!.id, prevStep);
      });
    } else {
      router.back();
    }
  }

  function handleFinish() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setTutorialProgress(tutorial!.id, steps.length);
    Animated.timing(stepOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
      setShowComplete(true);
    });
  }

  function handleGoHome() {
    router.replace("/(tabs)/learn");
  }

  function handleRestart() {
    setTutorialProgress(tutorial!.id, 0);
    setCurrentStep(0);
    setShowComplete(false);
    completePop.setValue(0);
    completeRotate.setValue(0);
    progressAnim.setValue(0);
    stepOpacity.setValue(1);
  }

  const isLastStep = currentStep === steps.length - 1;
  const s = styles(colors, insets);

  if (showComplete) {
    return (
      <Animated.View style={[s.container, { opacity: masterFade }]}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={handleGoHome} style={s.backButton} activeOpacity={0.8}>
            <Feather name="home" size={22} color={colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <Animated.View style={[s.completeContainer, { opacity: completePop }]}>
          <Animated.View
            style={{
              transform: [
                { perspective: 800 },
                {
                  scale: completePop.interpolate({
                    inputRange: [0, 0.5, 0.85, 1],
                    outputRange: [0.3, 1.2, 0.95, 1],
                  }),
                },
                {
                  rotateY: completeRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["180deg", "0deg"],
                  }),
                },
              ],
            }}
          >
            <View style={s.completeIconBg}>
              <Feather name="check-circle" size={72} color={colors.success} />
            </View>
          </Animated.View>

          <Animated.Text
            style={[
              s.completeTitle,
              {
                transform: [
                  {
                    translateY: completePop.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
                opacity: completePop,
              },
            ]}
          >
            Brilliant!
          </Animated.Text>
          <Animated.Text
            style={[
              s.completeText,
              {
                opacity: completePop,
                transform: [
                  {
                    translateY: completePop.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            You have completed the {tutorial.title} tutorial. You are doing a great job — keep it up!
          </Animated.Text>

          <Animated.View
            style={{
              width: "100%",
              gap: 12,
              opacity: completePop,
              transform: [
                {
                  translateY: completePop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            }}
          >
            <TouchableOpacity
              style={[s.button, { backgroundColor: colors.success }]}
              onPress={handleGoHome}
              activeOpacity={0.85}
            >
              <Feather name="home" size={22} color="#ffffff" />
              <Text style={s.buttonText}>Back to Tutorials</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.backTextButton}
              onPress={handleRestart}
              activeOpacity={0.85}
            >
              <Text style={s.backText}>Review Again</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[s.container, { opacity: masterFade }]}>
      <Animated.View style={[s.topBar, { transform: [{ translateY: headerSlide }] }]}>
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
          {currentStep + 1} / {steps.length}
        </Text>
      </Animated.View>

      <Animated.View style={[s.titleContainer, { transform: [{ translateY: headerSlide }] }]}>
        <Text style={s.tutorialTitle}>{tutorial.title}</Text>
        <View style={s.platformBadge}>
          <Feather name={isAndroid ? "cpu" : "monitor"} size={13} color={colors.secondary} />
          <Text style={s.platformBadgeText}>{isAndroid ? "Android" : "iPhone"}</Text>
        </View>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef as any}
        style={[s.scrollView, { opacity: stepOpacity, transform: [{ translateX: stepTranslate }] }]}
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
            image={step.image}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
          />
        ))}
      </Animated.ScrollView>

      <View style={s.footer}>
        <Animated.View style={{ transform: [{ scale: buttonBounce }] }}>
          {isLastStep ? (
            <TouchableOpacity
              style={[s.button, { backgroundColor: colors.success }]}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={s.buttonText}>I'm Done!</Text>
              <View style={s.buttonIconBox}>
                <Feather name="check" size={20} color={colors.success} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.button} onPress={handleNext} activeOpacity={0.85}>
              <Text style={s.buttonText}>I've Done This Step</Text>
              <View style={s.buttonIconBox}>
                <Feather name="arrow-right" size={20} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>
        <TouchableOpacity onPress={handleBack} style={s.backTextButton} activeOpacity={0.8}>
          <Text style={s.backText}>
            {currentStep === 0 ? "Back to Tutorials" : "Previous Step"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = (
  colors: ReturnType<typeof useColors>,
  insets: ReturnType<typeof useSafeAreaInsets>
) =>
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
      paddingVertical: 14,
      gap: 12,
    },
    backButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    progressContainer: {
      flex: 1,
      height: 10,
      backgroundColor: colors.steelBlue,
      borderRadius: 5,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 5,
    },
    stepCounter: {
      fontSize: 15,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      minWidth: 44,
      textAlign: "right",
    },
    titleContainer: {
      paddingHorizontal: 20,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    tutorialTitle: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
      flex: 1,
    },
    platformBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.steelBlue,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    platformBadgeText: {
      fontSize: 12,
      fontFamily: "Inter_600SemiBold",
      color: colors.secondary,
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
      paddingTop: 14,
      backgroundColor: colors.lavender,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 4,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      paddingVertical: 20,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 66,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.32,
      shadowRadius: 16,
      elevation: 10,
    },
    buttonText: {
      fontSize: 19,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    buttonIconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
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
      gap: 20,
    },
    completeIconBg: {
      width: 144,
      height: 144,
      borderRadius: 72,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 12,
    },
    completeTitle: {
      fontSize: 38,
      fontFamily: "Inter_700Bold",
      color: colors.primary,
    },
    completeText: {
      fontSize: 18,
      fontFamily: "Inter_400Regular",
      color: colors.mutedForeground,
      textAlign: "center",
      lineHeight: 29,
    },
  });
