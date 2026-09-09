import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Input } from "@shared/ui/Input/Input";
import { Button } from "@shared/ui/Button/Button";

export const EmployeeRegister = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Funcionário</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onBack}>
          <Text style={styles.headerButtonText}>botão</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <Text style={styles.sectionSubtitle}>
          Adicione as informações pessoais para concluir o cadastro
        </Text>

        <View style={styles.form}>
          <Input
            label="nome"
            placeholder="Rita Lee"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
          />
          <Input
            label="Telefone"
            placeholder="(79)91234-5678"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            keyboardType="phone-pad"
          />
          <Input
            label="Email"
            placeholder="exemplo@dominio.com"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            keyboardType="email-address"
          />
          <Input
            label="CPF"
            placeholder="123.456.789.00"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            keyboardType="numeric"
          />
          <Input
            label="Senha"
            placeholder="Senha"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            isPassword
          />
          <Input
            label="Repetir Senha"
            placeholder="Repetir Senha"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            isPassword
          />
        </View>

        <View style={styles.roleSectionHeader}>
          <Text style={styles.sectionTitle}>Cargo</Text>
        </View>

        <TouchableOpacity style={styles.roleDropdown}>
          <Text style={styles.roleDropdownText}>Professor</Text>
          <Feather name="chevron-down" size={20} color="#2C1E5C" />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button
            title="Confirmar"
            style={styles.confirmButton}
            backgroundColor="#7E60BF"
            textColor="#fff"
            onPress={() => console.log("Confirm Employee Registration")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: "#2C1E5C",
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
    paddingBottom: 100, // padding for bottom bar
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#02386A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Roboto_300Light",
    color: "#333",
    marginBottom: 24,
  },
  form: {
    marginBottom: 24,
  },
  roleSectionHeader: {
    marginBottom: 16,
  },
  roleDropdown: {
    backgroundColor: "#8b73c2", // A darker purple than inputs
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    width: "50%",
  },
  roleDropdownText: {
    fontSize: 16,
    fontFamily: "Roboto_500Medium",
    color: "#2C1E5C",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  confirmButton: {
    width: "100%",
  },
});
