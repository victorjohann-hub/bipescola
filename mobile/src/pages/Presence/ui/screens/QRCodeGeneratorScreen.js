import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Button } from "@shared/ui/Button/Button";

export const QRCodeGeneratorScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Qr Code</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>botão</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Código Qr para{"\n"}validação de presença
        </Text>

        <View style={styles.qrContainer}>
          {/* We can use a real QR code library later, for now we just show a placeholder box or icon */}
          <View style={styles.qrPlaceholder}>
            <Feather name="maximize" size={150} color="#000" />
            {/* The mock shows an actual QR code. Since we don't have an asset, using an icon placeholder */}
          </View>
        </View>

        <View style={styles.codeContainer}>
          <View>
            <Text style={styles.codeLabel}>Código</Text>
            <Text style={styles.codeValue}>asdffgsafsdfsdfgsdfgsd</Text>
          </View>
          <TouchableOpacity>
            <Feather name="copy" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Copiar código"
            backgroundColor="#9DCC65"
            textColor="#33691E"
            style={styles.copyBtn}
            onPress={() => console.log("Copied")}
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
    marginBottom: 32,
  },
  qrContainer: {
    marginBottom: 32,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  codeLabel: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: "#33691E",
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#000",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  copyBtn: {
    width: 200,
  },
});
