import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = [
  "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE",
  "#7EB3FF", "#55C98E", "#FF9F43", "#FD79A8",
];

const PARTICLE_COUNT = 48;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  color: string;
  size: number;
  shape: "rect" | "circle" | "diamond";
}

function createParticle(): Particle {
  return {
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(-30),
    rotation: new Animated.Value(0),
    opacity: new Animated.Value(1),
    scale: new Animated.Value(0.5 + Math.random() * 0.8),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.floor(Math.random() * 10),
    shape: (["rect", "circle", "diamond"] as const)[Math.floor(Math.random() * 3)],
  };
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const particles = useRef<Particle[]>(
    Array.from({ length: PARTICLE_COUNT }, createParticle)
  ).current;

  useEffect(() => {
    if (!active) return;

    const animations = particles.map((p, i) => {
      p.x.setValue(Math.random() * width);
      p.y.setValue(-30 - Math.random() * 80);
      p.rotation.setValue(0);
      p.opacity.setValue(1);
      p.scale.setValue(0.5 + Math.random() * 0.8);

      const duration = 1800 + Math.random() * 1400;
      const delay = Math.random() * 500;
      const targetX = (Math.random() - 0.5) * 200;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: height + 40,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.x, {
            toValue: p.x._value + targetX,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.rotation, {
            toValue: (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 5),
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(duration * 0.65),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: duration * 0.35,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    const combined = Animated.parallel(animations);
    combined.start(() => {
      onComplete?.();
    });

    return () => combined.stop();
  }, [active]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.55 : p.size,
            borderRadius:
              p.shape === "circle"
                ? p.size / 2
                : p.shape === "diamond"
                ? 2
                : 3,
            backgroundColor: p.color,
            transform: [
              { translateX: p.x },
              { translateY: p.y },
              {
                rotate: p.rotation.interpolate({
                  inputRange: [-10, 10],
                  outputRange: ["-360deg", "360deg"],
                }),
              },
              { scale: p.scale },
              ...(p.shape === "diamond" ? [{ rotate: "45deg" }] : []),
            ],
            opacity: p.opacity,
          }}
        />
      ))}
    </View>
  );
}
