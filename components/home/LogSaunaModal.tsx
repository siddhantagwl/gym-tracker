import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { insertSaunaSession } from "@/db/sessions";

export default function LogSaunaModal(props: {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { visible, onClose, onSaved } = props;
  const [duration, setDuration] = useState("");
  const [temperature, setTemperature] = useState("");

  useEffect(() => {
    if (visible) {
      setDuration("");
      setTemperature("");
    }
  }, [visible]);

  const durationNum = Number(duration);
  const canSave = Number.isFinite(durationNum) && durationNum > 0;

  const handleSave = () => {
    if (!canSave) return;
    const tempNum = Number(temperature);
    insertSaunaSession({
      durationMinutes: Math.round(durationNum),
      temperatureC: temperature.trim() && Number.isFinite(tempNum) ? Math.round(tempNum) : undefined,
    });
    onSaved();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 24 }}
      >
        <View
          style={{
            backgroundColor: "#161616",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "rgba(255,153,51,0.35)",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600", marginBottom: 4 }}>
            Log sauna
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 18 }}>
            Recovery entry · doesn&apos;t affect streak
          </Text>

          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6 }}>
            Duration (min)
          </Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="20"
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="number-pad"
            style={{
              color: "#fff",
              fontSize: 16,
              borderWidth: 1,
              borderColor: "#2a2a2a",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 16,
            }}
          />

          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6 }}>
            Temperature (°C) — optional
          </Text>
          <TextInput
            value={temperature}
            onChangeText={setTemperature}
            placeholder="80"
            placeholderTextColor="rgba(255,255,255,0.3)"
            keyboardType="number-pad"
            style={{
              color: "#fff",
              fontSize: 16,
              borderWidth: 1,
              borderColor: "#2a2a2a",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 22,
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12 }}>
            <Pressable onPress={onClose} style={{ paddingVertical: 10, paddingHorizontal: 14 }}>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 18,
                borderRadius: 8,
                backgroundColor: canSave ? "rgba(255,153,51,0.85)" : "rgba(255,153,51,0.25)",
              }}
            >
              <Text style={{ color: "#1a0e00", fontSize: 15, fontWeight: "700" }}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
