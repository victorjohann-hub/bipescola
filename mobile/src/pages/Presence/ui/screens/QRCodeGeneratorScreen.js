import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from "react-native";
import { ResponsiveContainer } from '@shared/ui/ResponsiveContainer/ResponsiveContainer';
import { Feather } from "@expo/vector-icons";
import { Button } from "@shared/ui/Button/Button";
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { apiClient } from '@shared/api/apiClient';

export const QRCodeGeneratorScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const userStr = await AsyncStorage.getItem('@bipescola_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(user);
          
          if (user.role === 'PARENT') {
            const res = await apiClient(`/students/pai/${user.id}`, { method: 'GET' });
            const list = res?.data || (Array.isArray(res) ? res : []);
            setStudents(list);
            if (list.length > 0) {
              setSelectedStudent(list[0]);
            }
          } else {
            // Se for Administrador ou Professor, carregar os estudantes para conferência
            const res = await apiClient('/students', { method: 'GET' });
            const list = res?.data || (Array.isArray(res) ? res : []);
            setStudents(list);
            if (list.length > 0) {
              setSelectedStudent(list[0]);
            }
          }
        }
      } catch (e) {
        console.error('Erro ao carregar dados do QR Code:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const qrValue = selectedStudent ? `aluno_${selectedStudent.id}` : '';

  const copyToClipboard = async () => {
    if (!qrValue) return;
    await Clipboard.setStringAsync(qrValue);
    Alert.alert('Sucesso', 'Código copiado para a área de transferência!');
  };

  return (
    <ResponsiveContainer style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR Code do Aluno</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerButtonText}>Voltar</Text>
          <Feather name="chevron-right" size={20} color="#D92D20" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          Código QR para validação de presença
        </Text>

        {/* Seletor de Dependente/Aluno se houver mais de um */}
        {students.length > 1 && (
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Selecione o(a) estudante:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
              {students.map((student) => {
                const isSelected = selectedStudent?.id === student.id;
                return (
                  <TouchableOpacity
                    key={student.id}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setSelectedStudent(student)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {student.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.qrContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#33691E" />
          ) : qrValue ? (
            <QRCode
              value={qrValue}
              size={210}
              color="black"
              backgroundColor="white"
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Feather name="alert-circle" size={40} color="#888" />
              <Text style={styles.emptyText}>
                {userData?.role === 'PARENT' 
                  ? "Nenhum estudante vinculado à sua conta de responsável." 
                  : "Nenhum aluno cadastrado no sistema."}
              </Text>
            </View>
          )}
        </View>

        {selectedStudent && (
          <View style={styles.codeContainer}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.studentName} numberOfLines={1}>{selectedStudent.nome}</Text>
              <Text style={styles.codeLabel}>Matrícula: {selectedStudent.matricula} • Turma: {selectedStudent.turma_nome || selectedStudent.turma_id}</Text>
              <Text style={styles.codeValue}>{qrValue}</Text>
            </View>
            <TouchableOpacity onPress={copyToClipboard} style={styles.copyIconBtn}>
              <Feather name="copy" size={22} color="#33691E" />
            </TouchableOpacity>
          </View>
        )}

        {selectedStudent && (
          <View style={styles.buttonContainer}>
            <Button
              title="Copiar código"
              backgroundColor="#9DCC65"
              textColor="#33691E"
              style={styles.copyBtn}
              onPress={copyToClipboard}
            />
          </View>
        )}
      </ScrollView>
    </ResponsiveContainer>
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
    padding: 24,
    alignItems: "center",
    paddingBottom: 48,
  },
  title: {
    fontSize: 18,
    fontFamily: "Roboto_700Bold",
    color: "#000",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  selectorContainer: {
    width: "100%",
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: "#555",
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chipActive: {
    backgroundColor: "#C5E1A5",
    borderColor: "#9DCC65",
  },
  chipText: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: "#444",
  },
  chipTextActive: {
    color: "#2E7D32",
    fontWeight: "700",
  },
  qrContainer: {
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#F1F8E9",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C5E1A5",
    marginBottom: 20,
  },
  studentName: {
    fontSize: 16,
    fontFamily: "Roboto_700Bold",
    color: "#1B5E20",
    marginBottom: 2,
  },
  codeLabel: {
    fontSize: 12,
    color: "#558B2F",
    fontFamily: "Roboto_400Regular",
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 13,
    fontFamily: "Roboto_500Medium",
    color: "#33691E",
  },
  copyIconBtn: {
    padding: 8,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  copyBtn: {
    width: "100%",
    maxWidth: 240,
  },
});
