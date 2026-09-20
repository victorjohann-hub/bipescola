import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const EvaluationCard = ({ evaluation }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Image 
          source={{ uri: evaluation.avatarUrl || 'https://via.placeholder.com/50' }} 
          style={styles.avatar} 
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{evaluation.authorName}</Text>
          <Text style={styles.role}>{evaluation.authorRole}</Text>
        </View>
      </View>
      
      <View style={styles.bodyContainer}>
        <Text style={styles.subject}>
          <Text style={styles.subjectLabel}>Aspecto: </Text>
          {evaluation.aspect}
        </Text>
        <Text style={styles.subject}>
          <Text style={styles.subjectLabel}>Nota: </Text>
          {evaluation.grade}
        </Text>
        <Text style={styles.subjectLabel}>Comentário</Text>
        <Text style={styles.content}>{evaluation.comment}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{evaluation.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#B8860B', // Dourado escuro / borda
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerTextContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500', 
  },
  role: {
    fontSize: 12,
    fontFamily: 'Roboto_300Light',
    color: '#B8860B',
  },
  bodyContainer: {
    marginBottom: 12,
  },
  subject: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  subjectLabel: {
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500',
  },
  content: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#000',
    lineHeight: 20,
    marginTop: 4,
  },
  footer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 10,
    color: '#B8860B',
  },
});
