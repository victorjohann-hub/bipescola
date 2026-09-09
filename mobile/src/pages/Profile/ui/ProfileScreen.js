import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export const ProfileScreen = () => {
  // Placeholder user data
  // You can toggle role between 'parent' and 'admin' to see different views
  const userRole = "parent"; // or 'admin'

  const userData = {
    name: userRole === "parent" ? "John Cena" : "Rita Lee",
    roleLabel: userRole === "parent" ? "Responsável" : "Professora Turma N",
    image: "https://i.pravatar.cc/150?img=68", // generic avatar placeholder
    cpf: "123.456.789-00",
    email: "Example@domain.com",
    telefone: "(12) 93456-7890",
    filho1: "Lebron James",
    cpfFilho: "234.567.890-11",
  };

  const messages = [
    {
      id: 1,
      senderName: "Sara Soares",
      senderRole: "Professora",
      avatar: "https://i.pravatar.cc/150?img=47",
      aspect: "Aspecto",
      grade: "5",
      comment:
        "Feedback inicial que serve para orientar o desenvolvimento futuro e identificar pontos fracos.",
      date: "12 de dez. 2026",
    },
    {
      id: 2,
      senderName: "Larissa Sato",
      senderRole: "Professora",
      avatar: "https://i.pravatar.cc/150?img=41",
      aspect: "Aspecto",
      grade: "5",
      comment:
        "Feedback inicial que serve para orientar o desenvolvimento futuro e identificar pontos fracos.",
      date: "12 de dez. 2026",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Informações Pessoais</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: userData.image }} style={styles.profileImage} />
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileRole}>{userData.roleLabel}</Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Informações pessoais</Text>

          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>CPF:</Text> {userData.cpf}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Email:</Text> {userData.email}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Telefone:</Text>{" "}
            {userData.telefone}
          </Text>

          {userRole === "parent" && (
            <>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Filho 1:</Text>{" "}
                {userData.filho1}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>CPF do Filho:</Text>{" "}
                {userData.cpfFilho}
              </Text>
            </>
          )}
        </View>

        {/* Messages Section */}
        <View style={styles.messagesSection}>
          <Text style={styles.sectionTitle}>
            {userRole === "parent"
              ? "Mensagens Recentes"
              : "Mensagens enviadas recentemente"}
          </Text>

          <TouchableOpacity style={styles.semesterDropdown}>
            <Text style={styles.semesterText}>Semestre X</Text>
            <Feather name="chevron-down" size={20} color="#5A9BD6" />
          </TouchableOpacity>

          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Image
                  source={{ uri: msg.avatar }}
                  style={styles.messageAvatar}
                />
                <View>
                  <Text style={styles.messageSenderName}>{msg.senderName}</Text>
                  <Text style={styles.messageSenderRole}>{msg.senderRole}</Text>
                </View>
              </View>

              <View style={styles.messageBody}>
                <Text style={styles.messageDetail}>
                  <Text style={styles.detailLabel}>{msg.aspect}</Text>
                  {"\n"}
                  Nota: <Text style={styles.boldText}>{msg.grade}</Text>
                </Text>

                <Text style={styles.detailLabel}>Comentário</Text>
                <Text style={styles.messageText}>{msg.comment}</Text>
              </View>

              <Text style={styles.messageDate}>{msg.date}</Text>
            </View>
          ))}
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
    borderBottomWidth: 2,
    borderBottomColor: "#D0E4F5", // light blue line under header
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    color: "#02386A",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Roboto_700Bold",
    color: "#000",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#666",
  },
  detailsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#02386A",
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  detailLabel: {
    fontFamily: "Roboto_700Bold",
    color: "#02386A",
  },
  boldText: {
    fontFamily: "Roboto_700Bold",
    color: "#000",
  },
  messagesSection: {
    marginBottom: 16,
  },
  semesterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  semesterText: {
    fontSize: 14,
    fontFamily: "Roboto_500Medium",
    color: "#5A9BD6",
    marginRight: 4,
  },
  messageCard: {
    borderWidth: 1,
    borderColor: "#5A9BD6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  messageSenderName: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#02386A",
  },
  messageSenderRole: {
    fontSize: 12,
    fontFamily: "Roboto_300Light",
    color: "#5A9BD6",
  },
  messageBody: {
    marginBottom: 8,
  },
  messageDetail: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#000",
    marginBottom: 8,
    lineHeight: 20,
  },
  messageText: {
    fontSize: 14,
    fontFamily: "Roboto_300Light",
    color: "#000",
    lineHeight: 20,
  },
  messageDate: {
    fontSize: 10,
    fontFamily: "Roboto_300Light",
    color: "#5A9BD6",
    textAlign: "right",
    marginTop: 8,
  },
});
