import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Button } from "@shared/ui/Button/Button";

export const QRCodeScannerScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scanner</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>botão</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Aproxime a câmera do{"\n"}Codigo Qr</Text>

        <View style={styles.scannerContainer}>
          {/* Mock scanner frame */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Inserir código"
            placeholderTextColor="#33691E"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Confirmar presença"
            backgroundColor="#9DCC65"
            textColor="#33691E"
            style={styles.confirmBtn}
            onPress={() => console.log("Confirmed presence")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    color: "#33691E",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButtonText: {
    color: "#D92D20",
    fontSize: 12,
    marginRight: 4,
    fontFamily: "Roboto_500Medium",
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#000",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 48,
  },
  scannerContainer: {
    width: 200,
    height: 200,
    position: "relative",
    marginBottom: 48,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#000",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#C5E1A5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8FC959",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "Roboto_300Light",
    color: "#33691E",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  confirmBtn: {
    width: 200,
  },
});
