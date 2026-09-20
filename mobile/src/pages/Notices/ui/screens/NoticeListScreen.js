import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NoticeCard } from '../components/NoticeCard';

const MOCK_NOTICES = [
  {
    id: '1',
    authorName: 'Sara Soares',
    authorRole: 'Professora',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    subject: 'Assunto X',
    content: 'Uma assunto provissório para preencher espaço que não possui texto, então foi necessário preencher esse espaço com um texto de preencher espaço não preenchido.',
    date: '12 de dez. 2026',
  },
  {
    id: '2',
    authorName: 'Sara Soares',
    authorRole: 'Professora',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    subject: 'Assunto X',
    content: 'Uma assunto provissório para preencher espaço que não possui texto, então foi necessário preencher esse espaço com um texto de preencher espaço não preenchido.',
    date: '12 de dez. 2026',
  },
  {
    id: '3',
    authorName: 'Sara Soares',
    authorRole: 'Professora',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    subject: 'Assunto X',
    content: 'Uma assunto provissório para preencher espaço que não possui texto, então foi necessário preencher esse espaço com um texto de preencher espaço não preenchido.',
    date: '12 de dez. 2026',
  },
];

export const NoticeListScreen = () => {
  const navigation = useNavigation();
  // Mock role para simular a diferença de perfis. Altere para 'PARENT' para ver como fica para os pais.
  const [role, setRole] = useState('ADM'); 

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {role !== 'PARENT' && (
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => navigation.navigate('NoticeCreate')}
        >
          <Text style={styles.createButtonText}>Criar aviso</Text>
          <Feather name="plus" size={20} color="#F06292" />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.semesterFilter}>
        <Text style={styles.semesterText}>Semestre X</Text>
        <Feather name="chevron-down" size={16} color="#F06292" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Toggle escondido para fins de teste/visualização de fluxo */}
        <TouchableOpacity onPress={() => setRole(role === 'PARENT' ? 'ADM' : 'PARENT')}>
          <Text style={styles.headerTitle}>Avisos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_NOTICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoticeCard notice={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B1A1A',
  },
  listContent: {
    padding: 24,
    paddingBottom: 100, // Espaço para a BottomTab
  },
  listHeader: {
    marginBottom: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  createButtonText: {
    fontSize: 16,
    color: '#F06292',
    fontWeight: 'bold',
    marginRight: 8,
  },
  semesterFilter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  semesterText: {
    fontSize: 14,
    color: '#F06292',
    fontWeight: 'bold',
    marginRight: 4,
  },
});
