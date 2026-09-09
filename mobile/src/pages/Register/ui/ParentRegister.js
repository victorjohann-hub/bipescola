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

export const ParentRegister = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cadastro de Responsável</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onBack}>
          <Text style={styles.headerButtonText}>botão</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Informações do Responsável</Text>
        <Text style={styles.sectionSubtitle}>
          Adicione as informações pessoais para concluir o cadastro
        </Text>

        <View style={styles.form}>
          <Input
            label="nome"
            placeholder="John Cena"
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

        <View style={styles.studentSectionHeader}>
          <Text style={styles.studentCount}>Aluno(a) 1</Text>
          <Text style={styles.sectionTitle}>
            Informações do Aluno(a)/Alunos(as)
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nome do Filho"
            placeholder="Nome do Filho"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
          />
          <Input
            label="CPF do Filho"
            placeholder="234.567.890-11"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            keyboardType="numeric"
          />
        </View>

        {/* We add some padding at the bottom to ensure scroll passes the nav bar if needed, 
            though the layout has Confirmar button at the bottom. Let's just put it here. */}
        <View style={styles.buttonContainer}>
          <Button
            title="Confirmar"
            style={styles.confirmButton}
            backgroundColor="#7E60BF"
            textColor="#fff"
            onPress={() => console.log("Confirm Parent Registration")}
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
  studentSectionHeader: {
    marginBottom: 16,
  },
  studentCount: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Roboto_300Light",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  confirmButton: {
    width: "100%",
  },
});
