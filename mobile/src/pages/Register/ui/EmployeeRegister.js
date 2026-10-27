import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button } from "@shared/ui/Button/Button";
import { RegisterInput } from "./RegisterInput";
import { Feather } from "@expo/vector-icons";
import { createUserAPI } from "@shared/api/userApi";

const ROLES = [
  { id: "PROF", label: "Professor" },
  { id: "PORTEIRO", label: "Porteiro" },
  { id: "ADM", label: "Coordenador / ADM" },
];

export const EmployeeRegister = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("PROF");

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert("Atenção", "Preencha ao menos Nome e Email.");
      return;
    }
    try {
      setLoading(true);
      const res = await createUserAPI({ nome: nome.trim(), email: email.trim(), role });
      const tempPass = res?.tempPassword || "Definida no sistema";
      Alert.alert(
        "Sucesso",
        `Cadastro de funcionário (${role}) realizado com sucesso!\n\nE-mail: ${email}\nSenha Temporária: ${tempPass}`,
        [
          {
            text: "OK",
            onPress: () => {
              setNome("");
              setTelefone("");
              setEmail("");
              setCpf("");
              setSenha("");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Erro", error.message || "Falha ao cadastrar funcionário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Cadastro de Funcionário</Text>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerSubtitle}>
          Adicione as informações pessoais para concluir{"\n"}o cadastro
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

        <View style={styles.form}>
          <RegisterInput 
            label="Nome" 
            placeholder="Ex: Carlos Silva" 
            value={nome}
            onChangeText={setNome}
          />
          <RegisterInput
            label="Telefone (Opcional)"
            placeholder="Ex: (79) 91234-5678"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />
          <RegisterInput
            label="Email"
            placeholder="Ex: carlos@bipescola.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <RegisterInput
            label="CPF (Opcional)"
            placeholder="Ex: 123.456.789-00"
            keyboardType="numeric"
            value={cpf}
            onChangeText={setCpf}
          />
        </View>

        <Text style={styles.sectionTitle}>Cargo / Perfil de Acesso</Text>

        <View style={styles.rolesRow}>
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[styles.roleChip, isSelected && styles.roleChipActive]}
                onPress={() => setRole(r.id)}
              >
                <Feather
                  name={r.id === "ADM" ? "shield" : r.id === "PORTEIRO" ? "key" : "book-open"}
                  size={16}
                  color={isSelected ? "#fff" : "#444"}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.roleChipText, isSelected && styles.roleChipTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#666666" />
          ) : (
            <Button
              title="Cadastrar Funcionário"
              style={styles.confirmButton}
              backgroundColor="#68519d"
              textColor="#fff"
              onPress={handleRegister}
            />
          )}
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    color: "#000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Roboto_300Light",
    color: "#555",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Roboto_700Bold",
    color: "#000",
    marginBottom: 12,
    marginTop: 8,
  },
  form: {
    marginBottom: 8,
  },
  rolesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 28,
  },
  roleChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  roleChipActive: {
    backgroundColor: "#68519d",
    borderColor: "#4A3B73",
  },
  roleChipText: {
    fontSize: 12,
    fontFamily: "Roboto_500Medium",
    color: "#444",
  },
  roleChipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  confirmButton: {
    width: "100%",
  },
});
