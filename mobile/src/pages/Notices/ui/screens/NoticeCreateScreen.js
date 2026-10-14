import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createPostAPI } from '@shared/api/schoolApi';
import { listParentsAPI } from '@shared/api/adminApi';
import { Button } from '@shared/ui/Button/Button';
import { colors, radius, shadows, spacing, typography } from '@shared/theme';

export const NoticeCreateScreen = () => {
  const navigation = useNavigation();
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Lógica de Destinatários
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await listParentsAPI();
        setParents([{ id: 'todos', nome: 'Todos os Responsáveis (Aviso Geral)' }, ...(res.data || res || [])]);
        setSelectedParent({ id: 'todos', nome: 'Todos os Responsáveis (Aviso Geral)' });
      } catch (error) {
        console.error("Erro ao carregar pais", error);
      }
    };
    fetchParents();
  }, []);

  const handleCreate = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      Alert.alert('Atenção', 'Preencha o assunto e o conteúdo do aviso.');
      return;
    }

    try {
      setLoading(true);
      const payload = { 
        titulo, 
        conteudo,
        destinatario_id: selectedParent?.id === 'todos' ? null : selectedParent?.id
      };
      await createPostAPI(payload);
      Alert.alert('Sucesso', 'Aviso publicado no mural com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao criar aviso.');
    } finally {
      setLoading(false);
    }
  };

  const selectParent = (parent) => {
    setSelectedParent(parent);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Comunicado</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenSubtitle}>
          Publique avisos e recados para a comunidade escolar
        </Text>

        <View style={styles.formCard}>
          {/* Seletor de Destinatário */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Destinatário do Aviso</Text>
            <TouchableOpacity 
              style={styles.dropdownBtn}
              activeOpacity={0.7}
              onPress={() => setModalVisible(true)}
            >
              <Feather name="users" size={18} color={colors.notice} style={{ marginRight: spacing.sm }} />
              <Text style={styles.dropdownBtnText} numberOfLines={1}>
                {selectedParent ? selectedParent.nome : 'Selecione um destinatário...'}
              </Text>
              <Feather name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Assunto / Título */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Assunto do Comunicado</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input} 
                placeholder="Ex: Reunião Pedagógica de Pais" 
                placeholderTextColor={colors.textMuted} 
                value={titulo}
                onChangeText={setTitulo}
              />
            </View>
          </View>

          {/* Conteúdo */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mensagem Completa</Text>
            <View style={styles.textAreaContainer}>
              <TextInput 
                style={styles.textArea} 
                placeholder="Escreva os detalhes, datas e orientações do comunicado..." 
                placeholderTextColor={colors.textMuted}
                multiline
                textAlignVertical="top"
                value={conteudo}
                onChangeText={setConteudo}
              />
            </View>
          </View>

          <View style={styles.submitSection}>
            <Button
              title="Publicar Comunicado"
              backgroundColor={colors.notice}
              loading={loading}
              onPress={handleCreate}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modal de Seleção de Destinatário */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolha o Destinatário</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={parents}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.modalItem,
                    selectedParent?.id === item.id && styles.modalItemSelected
                  ]} 
                  onPress={() => selectParent(item)}
                >
                  <Feather 
                    name={item.id === 'todos' ? 'globe' : 'user'} 
                    size={16} 
                    color={selectedParent?.id === item.id ? colors.notice : colors.textMuted} 
                    style={{ marginRight: spacing.sm }}
                  />
                  <Text style={[
                    styles.modalItemText,
                    selectedParent?.id === item.id && styles.modalItemTextSelected
                  ]}>
                    {item.nome || item.email}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.md,
  },
  screenSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  formGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  dropdownBtnText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto_500Medium',
    color: colors.textPrimary,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
    fontFamily: 'Roboto_400Regular',
    color: colors.textPrimary,
  },
  textAreaContainer: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 120,
  },
  textArea: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: colors.textPrimary,
    minHeight: 100,
  },
  submitSection: {
    marginTop: spacing.sm,
  },
  // Modal de Destinatários
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '75%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.modal,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalItemSelected: {
    backgroundColor: colors.noticeSurface,
    borderRadius: radius.sm,
  },
  modalItemText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  modalItemTextSelected: {
    fontWeight: '700',
    color: colors.notice,
  },
});
