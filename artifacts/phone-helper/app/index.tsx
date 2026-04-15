import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useApp } from "@/context/AppContext";
import { DeviceModal } from "@/components/DeviceModal";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useColors } from "@/hooks/useColors";
import { router } from "expo-router";

export default function IndexScreen() {
  const { deviceType, setDeviceType, hasCompletedOnboarding, setHasCompletedOnboarding } = useApp();
  const [showModal, setShowModal] = useState(false);
  const colors = useColors();

  useEffect(() => {
    if (!deviceType) {
      setShowModal(true);
    }
  }, [deviceType]);

  function handleDeviceSelect(device: "android" | "apple") {
    setDeviceType(device);
    setShowModal(false);
  }

  function handleGetStarted() {
    setHasCompletedOnboarding(true);
    router.push("/(tabs)/learn");
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.lavender }]}>
      <DeviceModal
        visible={showModal}
        onSelect={handleDeviceSelect}
      />
      {deviceType && !showModal && (
        <WelcomeScreen
          deviceType={deviceType}
          onGetStarted={handleGetStarted}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
