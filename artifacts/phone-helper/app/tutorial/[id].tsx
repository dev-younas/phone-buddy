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
import { Confetti } from "@/components/Confetti";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");

export default function TutorialScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { deviceType, tutorialProgress, setTutorialProgress, isDarkMode } = useApp();

  const tutorial = tutorials.find((t) => t.id === id);
  const isAndroid = deviceType === "android";
  const steps = tutorial ? (isAndroid ? tutorial.androidSteps : tutorial.appleSteps) : [];

  const savedStep = tutorial ? (tutorialProgress[tutorial.id] ?? 0) : 0;
  const initialStep = savedStep >= steps.length ? 0 : savedStep;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showComplete, setShowComplete] = useState(
    savedStep >= steps.length && steps.length > 0
  );
  const [showConfetti, setShowConfetti] = useState(false);

  const masterFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const stepTranslate = useRef(new Animated.Value(0)).current;
  const stepOpacity = useRef(new Animated.Value(1)).current;
  const buttonBounce = useRef(new Animated.Value(1)).current;
  const completePop = useRef(new Animated.Value(0)).current;
  const completeRotate = useRef(new Animated.Value(0)).current;
  const completeIconBounce = useRef(new Animated.Value(0)).current;
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
        duration: 550,
        useNativeDriver: false,
      }).start();
    }
  }, [currentStep, steps.length, showComplete]);

  useEffect(() => {
    if (showComplete) {
      setShowConfetti(true);
      Animated.sequence([
        Animated.parallel([
          Animated.spring(completePop, { toValue: 1, tension: 52, friction: 7, useNativeDriver: true }),
          Animated.timing(completeRotate, { toValue: 1, duration: 650, useNativeDriver: true }),
        ]),
        Animated.delay(200),
        Animated.loop(
          Animated.sequence([
            Animated.timing(completeIconBounce, { toValue: -10, duration: 1500, useNativeDriver: true }),
            Animated.timing(completeIconBounce, { toValue: 0, duration: 1500, useNativeDriver: true }),
          ]),
          { iterations: 3 }
        ),
      ]).start();
    }
  }, [showComplete]);

  const animateStepTransition = useCallback((direction: "forward" | "back", callback: () => void) => {
    const outX = direction === "forward" ? -width * 0.28 : width * 0.28;
    const inX = direction === "forward" ? width * 0.28 : -width * 0.28;

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
      Animated.timing(buttonBounce, { toValue: 0.91, duration: 80, useNativeDriver: true }),
      Animated.spring(buttonBounce, { toValue: 1, tension: 220, friction: 5, useNativeDriver: true }),
    ]).start();
    animateStepTransition("forward", () => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setTutorialProgress(tutorial!.id, nextStep);
    });
  }

  function handleBack() {
    if (currentStep > 0) {
      if (Platform.OS !== "web") Haptics.selectionAsync();
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
    setShowConfetti(false);
    completePop.setValue(0);
    completeRotate.setValue(0);
    completeIconBounce.setValue(0);
    progressAnim.setValue(0);
    stepOpacity.setValue(1);
  }

  const isLastStep = currentStep === steps.length - 1;
  const bg = isDarkMode ? colors.background : "#FFF8F0";
  const cardBg = isDarkMode ? colors.card : "#FFFFFF";
  const s = styles(colors, insets);

  if (showComplete) {
    return (
      <Animated.View style={[s.container, { backgroundColor: bg, opacity: masterFade }]}>
        <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

        <View style={s.topBar}>
          <TouchableOpacity onPress={handleGoHome} style={[s.backButton, { backgroundColor: cardBg }]} activeOpacity={0.8}>
            <Feather name="home" size={22} color={colors.primary} />
          </TouchableOpacity>
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
                { translateY: completeIconBounce },
              ],
            }}
          >
            <View style={[s.completeIconBg, { backgroundColor: cardBg }]}>
              <Text style={{ fontSize: 68 }}>🎉</Text>
            </View>
          </Animated.View>

          <Animated.Text
            style={[
              s.completeTitle,
              { color: colors.primary },
              {
                transform: [{
                  translateY: completePop.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }),
                }],
                opacity: completePop,
              },
            ]}
          >
            Brilliant work!
          </Animated.Text>
          <Animated.Text
            style={[
              s.completeText,
              { color: colors.mutedForeground },
              {
                opacity: completePop,
                transform: [{
                  translateY: completePop.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
                }],
              },
            ]}
          >
            You've completed the {tutorial.title} tutorial! You should be very proud of yourself! 🌟
          </Animated.Text>

          <Animated.View
            style={{
              width: "100%",
              gap: 12,
              opacity: completePop,
              transform: [{
                translateY: completePop.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }),
              }],
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
            <TouchableOpacity style={s.backTextButton} onPress={handleRestart} activeOpacity={0.85}>
              <Text style={[s.backText, { color: colors.mutedForeground }]}>Review Again</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[s.container, { backgroundColor: bg, opacity: masterFade }]}>
      <Animated.View style={[s.topBar, { transform: [{ translateY: headerSlide }] }]}>
        <TouchableOpacity onPress={handleBack} style={[s.backButton, { backgroundColor: cardBg }]} activeOpacity={0.8}>
          <Feather name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={[s.progressContainer, { backgroundColor: colors.muted }]}>
          <Animated.View
            style={[
              s.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <Text style={[s.stepCounter, { color: colors.primary }]}>
          {currentStep + 1} / {steps.length}
        </Text>
      </Animated.View>

      <Animated.View style={[s.titleContainer, { transform: [{ translateY: headerSlide }] }]}>
        <Text style={[s.tutorialTitle, { color: colors.primary }]}>{tutorial.title}</Text>
        <View style={[s.platformBadge, { backgroundColor: colors.muted }]}>
          <Feather name={isAndroid ? "cpu" : "monitor"} size={13} color={colors.secondary} />
          <Text style={[s.platformBadgeText, { color: colors.secondary }]}>
            {isAndroid ? "Android" : "iPhone"}
          </Text>
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

      <View style={[s.footer, { backgroundColor: bg, borderTopColor: colors.muted }]}>
        <Animated.View style={{ transform: [{ scale: buttonBounce }] }}>
          {isLastStep ? (
            <TouchableOpacity
              style={[s.button, { backgroundColor: colors.success }]}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={s.buttonText}>🎉  I'm Done!</Text>
              <View style={[s.buttonIconBox, { backgroundColor: "#ffffff" }]}>
                <Feather name="check" size={22} color={colors.success} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[s.button, { backgroundColor: colors.primary }]} onPress={handleNext} activeOpacity={0.85}>
              <Text style={s.buttonText}>I've Done This Step</Text>
              <View style={[s.buttonIconBox, { backgroundColor: "#ffffff" }]}>
                <Feather name="arrow-right" size={22} color={colors.primary} />
              </View>
            </TouchableOpacity>
          )}
        </Animated.View>
        <TouchableOpacity onPress={handleBack} style={s.backTextButton} activeOpacity={0.8}>
          <Text style={[s.backText, { color: colors.mutedForeground }]}>
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
      width: 50,
      height: 50,
      borderRadius: 25,
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
      height: 11,
      borderRadius: 6,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: 6,
    },
    stepCounter: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      minWidth: 48,
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
      fontSize: 28,
      fontFamily: "Inter_700Bold",
      flex: 1,
    },
    platformBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    platformBadgeText: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16,
      paddingTop: 14,
      gap: 8,
      borderTopWidth: 1,
    },
    button: {
      borderRadius: 22,
      paddingVertical: 22,
      paddingHorizontal: 26,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 70,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.32,
      shadowRadius: 16,
      elevation: 10,
    },
    buttonText: {
      fontSize: 21,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    buttonIconBox: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    backTextButton: {
      alignItems: "center",
      paddingVertical: 10,
    },
    backText: {
      fontSize: 17,
      fontFamily: "Inter_500Medium",
    },
    completeContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 34,
      gap: 22,
    },
    completeIconBg: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
      elevation: 12,
    },
    completeTitle: {
      fontSize: 40,
      fontFamily: "Inter_700Bold",
    },
    completeText: {
      fontSize: 19,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      lineHeight: 31,
    },
  });
