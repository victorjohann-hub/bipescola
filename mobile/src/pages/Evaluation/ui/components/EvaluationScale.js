import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EvaluationScale = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escala</Text>
      <View style={styles.scaleRow}>
        <View style={styles.scaleItem}>
          <Text style={styles.scaleLabel}>Péssimo</Text>
          <Text style={styles.scaleValue}>1</Text>
        </View>
        <View style={styles.scaleItem}>
          <Text style={styles.scaleLabel}>Ruim</Text>
          <Text style={styles.scaleValue}>2</Text>
        </View>
        <View style={styles.scaleItem}>
          <Text style={styles.scaleLabel}>Regular</Text>
          <Text style={styles.scaleValue}>3</Text>
        </View>
        <View style={styles.scaleItem}>
          <Text style={styles.scaleLabel}>Bom</Text>
          <Text style={styles.scaleValue}>4</Text>
        </View>
        <View style={styles.scaleItem}>
          <Text style={styles.scaleLabel}>Ótimo</Text>
          <Text style={styles.scaleValue}>5</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500', // Dourado escuro
    marginBottom: 12,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  scaleItem: {
    alignItems: 'center',
  },
  scaleLabel: {
    fontSize: 10,
    color: '#000',
    marginBottom: 4,
  },
  scaleValue: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#000',
  },
});
