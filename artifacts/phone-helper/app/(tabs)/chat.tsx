import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useApp, ChatMessage } from "@/context/AppContext";
import * as Haptics from "expo-haptics";

const AGENT_NAME = "Sarah";
const AGENT_EMOJI = "👩‍💼";

function getAgentReply(userText: string): string {
  const t = userText.toLowerCase();
  if (t.match(/whatsapp|what.?s.?app/)) {
    return "I can definitely help with WhatsApp! 😊 Go to the Learn tab and tap 'Install WhatsApp' — each step has a picture showing exactly what you'll see on your screen. Which step are you stuck on?";
  }
  if (t.match(/wi.?fi|internet|connect|network/)) {
    return "Wi-Fi can be a bit tricky! 📶 Our Wi-Fi tutorial in the Learn tab has pictures for every step. Is your phone an Android or an iPhone? That way I can give you the most helpful tip!";
  }
  if (t.match(/battery|charge|charging|power/)) {
    return "Oh, a draining battery — how annoying! 🔋 Quick fix: lower your screen brightness and turn on Battery Saver (Android) or Low Power Mode (iPhone). Check the Help tab for step-by-step tips!";
  }
  if (t.match(/slow|freeze|frozen|hang|stuck|crash/)) {
    return "A slow phone is no fun at all! 🐌 The best first step is to restart your phone — hold the power button for a few seconds. That fixes most slow-downs instantly. Try it and let me know!";
  }
  if (t.match(/storage|space|full|memory/)) {
    return "Running out of space! 📦 The Help tab has a 'Phone Storage is Full' guide. The quickest win is deleting photos you no longer need — they take up the most space. Want me to explain how?";
  }
  if (t.match(/call|ring|hear|sound|volume|mute/)) {
    return "Can't make or receive calls? 📵 First, check that Airplane Mode is switched OFF in Settings. Also make sure your volume isn't turned all the way down using the buttons on the side of your phone!";
  }
  if (t.match(/hello|hi |hey |good morning|good afternoon|good evening/)) {
    return "Hello! So lovely to hear from you! 😊 I'm here and happy to help. What's on your mind today?";
  }
  if (t.match(/thank|thanks|thank you/)) {
    return "You're so very welcome! 🌟 It's my pleasure to help. Don't hesitate to ask if anything else comes up — that's what I'm here for!";
  }
  if (t.match(/password|forgot|reset/)) {
    return "Forgotten passwords are very common — don't worry! 🔑 For your phone password, on Android go to Settings > Security, and on iPhone go to Settings > Face ID & Passcode. What kind of password is it for?";
  }
  if (t.match(/photo|picture|camera|selfie/)) {
    return "Photos and cameras! 📸 The camera is usually that little icon that looks like a camera on your home screen. If you're having trouble finding it, look for 'Camera' in your apps list!";
  }
  const responses = [
    "That's a great question! 😊 Let me look into that for you. In the meantime, you might find an answer in our Learn and Help tabs — we've written everything in plain English, no jargon!",
    "Thank you for getting in touch! 💬 Our friendly support team will get back to you within a few hours. While you wait, the Help tab has answers to our most common questions!",
    "I appreciate you reaching out! 🌟 I want to make sure I give you the right help. Could you tell me a little more about what's happening? The more detail, the better I can assist!",
    "Great question — I want to make sure I give you exactly the right answer! 🎯 Could you tell me whether you have an Android phone or an iPhone? That'll help me point you to the right guide!",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function TypingIndicator({ colors }: { colors: any }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );
    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 160);
    const a3 = animate(dot3, 320);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  return (
    <View style={[typingStyles.bubble, { backgroundColor: colors.chatBubbleAgent, borderColor: colors.muted }]}>
      <View style={typingStyles.agentRow}>
        <View style={[typingStyles.agentAvatar, { backgroundColor: colors.secondary }]}>
          <Text style={typingStyles.agentEmoji}>{AGENT_EMOJI}</Text>
        </View>
        <View style={typingStyles.dots}>
          {[dot1, dot2, dot3].map((d, i) => (
            <Animated.View
              key={i}
              style={[
                typingStyles.dot,
                { backgroundColor: colors.mutedForeground, transform: [{ translateY: d }] },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  bubble: {
    alignSelf: "flex-start",
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    maxWidth: "72%",
  },
  agentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  agentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  agentEmoji: { fontSize: 16 },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

function MessageBubble({ msg, colors }: { msg: ChatMessage; colors: any }) {
  const isUser = msg.sender === "user";
  const slideAnim = useRef(new Animated.Value(isUser ? 30 : -30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 70, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        s(colors).messageBubble,
        isUser ? s(colors).userBubble : s(colors).agentBubble,
        { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
      ]}
    >
      {!isUser && (
        <View style={s(colors).agentMeta}>
          <View style={s(colors).agentAvatarSmall}>
            <Text style={{ fontSize: 15 }}>{AGENT_EMOJI}</Text>
          </View>
          <Text style={[s(colors).agentName, { color: colors.secondary }]}>{AGENT_NAME}</Text>
        </View>
      )}
      <Text style={[s(colors).messageText, { color: isUser ? colors.chatBubbleUserText : colors.chatBubbleAgentText }]}>
        {msg.text}
      </Text>
      <Text style={[s(colors).messageTime, { color: isUser ? "rgba(255,255,255,0.65)" : colors.mutedForeground }]}>
        {formatTime(msg.timestamp)}
      </Text>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { chatMessages, addChatMessage, setChatUnread } = useApp();
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const sendScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 65, friction: 8, useNativeDriver: true }),
    ]).start();
    setChatUnread(0);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatMessages, isTyping]);

  const sendMessage = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.sequence([
      Animated.timing(sendScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(sendScale, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      text,
      sender: "user",
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);
    setInputText("");
    setIsTyping(true);

    const delay = 1400 + Math.random() * 900;
    setTimeout(() => {
      setIsTyping(false);
      const reply = getAgentReply(text);
      const agentMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        text: reply,
        sender: "agent",
        timestamp: Date.now(),
      };
      addChatMessage(agentMsg);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, delay);
  }, [inputText, addChatMessage]);

  const bg = { backgroundColor: colors.background };
  const cs = s(colors);

  return (
    <KeyboardAvoidingView
      style={[cs.container, bg]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <Animated.View
        style={[
          cs.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
          { transform: [{ translateY: headerSlide }], opacity: fadeAnim },
        ]}
      >
        <View style={[cs.agentAvatar, { backgroundColor: colors.secondary }]}>
          <Text style={cs.agentAvatarEmoji}>{AGENT_EMOJI}</Text>
        </View>
        <View style={cs.headerInfo}>
          <Text style={[cs.headerName, { color: colors.foreground }]}>{AGENT_NAME} — PhoneBuddy Support</Text>
          <View style={cs.onlineRow}>
            <View style={[cs.onlineDot, { backgroundColor: colors.success }]} />
            <Text style={[cs.onlineText, { color: colors.success }]}>Online — Ready to help</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[cs.disclaimer, { backgroundColor: colors.muted, opacity: fadeAnim }]}>
        <Feather name="info" size={13} color={colors.mutedForeground} />
        <Text style={[cs.disclaimerText, { color: colors.mutedForeground }]}>
          Friendly AI support — real team replies within a few hours
        </Text>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        style={cs.messageList}
        contentContainerStyle={[cs.messageListContent, { paddingBottom: 12 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {chatMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} colors={colors} />
        ))}
        {isTyping && <TypingIndicator colors={colors} />}
      </ScrollView>

      <View
        style={[
          cs.inputBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 12,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={[cs.input, { backgroundColor: colors.input, color: colors.foreground, borderColor: colors.border }]}
          placeholder="Type your question here..."
          placeholderTextColor={colors.mutedForeground}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Animated.View style={{ transform: [{ scale: sendScale }] }}>
          <TouchableOpacity
            style={[cs.sendButton, { backgroundColor: inputText.trim() ? colors.primary : colors.muted }]}
            onPress={sendMessage}
            activeOpacity={0.82}
            disabled={!inputText.trim()}
          >
            <Feather name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = (colors: ReturnType<typeof useColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: Platform.OS === "web" ? 67 : 54,
      paddingHorizontal: 18,
      paddingBottom: 14,
      borderBottomWidth: 1,
      gap: 14,
    },
    agentAvatar: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: "center",
      justifyContent: "center",
    },
    agentAvatarEmoji: {
      fontSize: 26,
    },
    headerInfo: {
      flex: 1,
    },
    headerName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      marginBottom: 4,
    },
    onlineRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    onlineDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    onlineText: {
      fontSize: 16,
      fontFamily: "Inter_500Medium",
    },
    disclaimer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    disclaimerText: {
      fontSize: 15,
      fontFamily: "Inter_400Regular",
      flex: 1,
    },
    messageList: {
      flex: 1,
    },
    messageListContent: {
      paddingHorizontal: 16,
      paddingTop: 14,
    },
    messageBubble: {
      maxWidth: "80%",
      borderRadius: 22,
      padding: 14,
      marginBottom: 10,
    },
    userBubble: {
      alignSelf: "flex-end",
      backgroundColor: colors.chatBubbleUser,
      borderBottomRightRadius: 6,
    },
    agentBubble: {
      alignSelf: "flex-start",
      backgroundColor: colors.chatBubbleAgent,
      borderBottomLeftRadius: 6,
      borderWidth: 1,
      borderColor: colors.muted,
    },
    agentMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    agentAvatarSmall: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.secondary,
      alignItems: "center",
      justifyContent: "center",
    },
    agentName: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
    messageText: {
      fontSize: 20,
      fontFamily: "Inter_400Regular",
      lineHeight: 30,
    },
    messageTime: {
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      marginTop: 6,
      textAlign: "right",
    },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      gap: 10,
    },
    input: {
      flex: 1,
      borderRadius: 24,
      borderWidth: 1.5,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 20,
      fontFamily: "Inter_400Regular",
      maxHeight: 140,
      lineHeight: 28,
    },
    sendButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
  });
