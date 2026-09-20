import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const NoticeCard = ({ notice }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Image 
          source={{ uri: notice.avatarUrl || 'https://via.placeholder.com/50' }} 
          style={styles.avatar} 
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.name}>{notice.authorName}</Text>
          <Text style={styles.role}>{notice.authorRole}</Text>
        </View>
      </View>
      
      <View style={styles.bodyContainer}>
        <Text style={styles.subject}>
          <Text style={styles.subjectLabel}>Assunto: </Text>
          {notice.subject}
        </Text>
        <Text style={styles.content}>{notice.content}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.date}>{notice.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F06292', // Rosa do design
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
    color: '#8B1A1A', // Vermelho escuro
  },
  role: {
    fontSize: 12,
    fontFamily: 'Roboto_300Light',
    color: '#F06292',
  },
  bodyContainer: {
    marginBottom: 12,
  },
  subject: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  subjectLabel: {
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B1A1A',
  },
  content: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#000',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 10,
    color: '#F06292',
  },
});
