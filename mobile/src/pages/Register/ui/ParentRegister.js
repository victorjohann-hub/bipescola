import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Input } from "@shared/ui/Input/Input";
import { Button } from "@shared/ui/Button/Button";
import { createParentAPI } from "@shared/api/userApi";

export const ParentRegister = ({ onBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const response = await createParentAPI({ name, email });
      
      // Exibe a senha temporária gerada pelo backend
      Alert.alert(
        "Cadastro Concluído!",
        `Conta criada com sucesso.\nSua senha de acesso é: ${response.tempPassword}\nGuarde-a com segurança!`,
        [{ text: "OK", onPress: onBack }]
      );
    } catch (error) {
      Alert.alert("Erro no cadastro", error.message || "Não foi possível concluir o cadastro.");
    } finally {
      setLoading(false);
    }
  };

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
            label="Nome"
            placeholder="John Cena"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="Email"
            placeholder="exemplo@dominio.com"
            backgroundColor="#C1B4D8"
            borderColor="#68519d"
            labelColor="#68519d"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#7E60BF" />
          ) : (
            <Button
              title="Confirmar"
              style={styles.confirmButton}
              backgroundColor="#7E60BF"
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
  buttonContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  confirmButton: {
    width: "100%",
  },
});
