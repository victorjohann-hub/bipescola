import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export const PresenceMenuScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Validação de Presença</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Admin Section: Ler QR Code */}
        <Text style={styles.sectionTitle}>Ler QR Code</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("QRCodeScanner")}
        >
          <Text style={styles.menuItemTextActive}>Scanner</Text>
          <Feather name="plus" size={20} color="#8FC959" />
        </TouchableOpacity>

        {/* Parent Section: Gerar QR Code */}
        <Text style={styles.sectionTitle}>Gerar código Qr code</Text>
        <TouchableOpacity
          style={[styles.menuItem, styles.menuItemActive]}
          onPress={() => navigation.navigate("QRCodeGenerator")}
        >
          <Text style={styles.menuItemTextActive}>Gerar Qr code</Text>
          <Feather name="plus" size={20} color="#33691E" />
        </TouchableOpacity>

        {/* Classes Section */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
          Turmas / Presenças
        </Text>
        <Text style={styles.sectionSubtitle}>Selecione uma turma:</Text>

        {[1, 2, 3, 4, 5].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.classItem, index === 2 && styles.classItemActive]}
            onPress={() => navigation.navigate("ClassList", { classId: item })}
          >
            <Text
              style={[
                styles.classItemText,
                index === 2 && styles.classItemTextActive,
              ]}
            >
              nome
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.arrowDownContainer}>
          <Feather name="chevron-down" size={24} color="#000" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
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
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#33691E",
    marginBottom: 16,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#666",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 16,
  },
  menuItemActive: {
    backgroundColor: "#C5E1A5",
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: "#8FC959",
  },
  menuItemTextActive: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: "#33691E",
  },
  classItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  classItemActive: {
    backgroundColor: "#C5E1A5",
  },
  classItemText: {
    fontSize: 16,
    fontFamily: "Roboto_300Light",
    color: "#8FC959",
  },
  classItemTextActive: {
    fontFamily: "Roboto_500Medium",
    color: "#33691E",
  },
  arrowDownContainer: {
    alignItems: "center",
    marginTop: 16,
  },
});
