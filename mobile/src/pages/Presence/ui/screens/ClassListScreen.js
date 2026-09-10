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

export const ClassListScreen = ({ navigation, route }) => {
  // In a real app we would fetch the class data based on route.params.classId

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Validação de Presença</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>Voltar</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Turma N</Text>
        <Text style={styles.sectionSubtitle}>Selecione um aluno</Text>

        {/* List of students */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.studentItem,
              index === 1 && styles.studentItemActive,
            ]}
            onPress={() => console.log("Selected student", item)}
          >
            <Text
              style={[
                styles.studentItemText,
                index === 1 && styles.studentItemTextActive,
              ]}
            >
              nome
            </Text>
          </TouchableOpacity>
        ))}
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#33691E",
    marginBottom: 8,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#666",
    marginBottom: 16,
  },
  studentItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  studentItemActive: {
    backgroundColor: "#C5E1A5",
  },
  studentItemText: {
    fontSize: 16,
    fontFamily: "Roboto_300Light",
    color: "#8FC959",
  },
  studentItemTextActive: {
    fontFamily: "Roboto_500Medium",
    color: "#33691E",
  },
});
