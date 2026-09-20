import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MOCK_DATA = [
  { id: 1, label: 'Aspecto 1', sem1: 1, sem2: 1 },
  { id: 2, label: 'Aspecto 2', sem1: 1, sem2: 1 },
  { id: 3, label: 'Aspecto 3', sem1: 1, sem2: 1 },
  { id: 4, label: 'Aspecto 4', sem1: 1, sem2: 1 },
  { id: 5, label: 'Aspecto 5', sem1: 1, sem2: 1 },
];

export const EvaluationTable = () => {
  return (
    <View style={styles.table}>
      {/* Table Header */}
      <View style={[styles.row, styles.headerRow]}>
        <View style={[styles.cell, styles.headerCell, styles.flex2]}>
          <Text style={styles.headerText}>Aspectos</Text>
        </View>
        <View style={[styles.cell, styles.headerCell, styles.flex1]}>
          <Text style={styles.headerText}>Semestre 1</Text>
        </View>
        <View style={[styles.cell, styles.headerCell, styles.flex1]}>
          <Text style={styles.headerText}>Semestre 2</Text>
        </View>
      </View>

      {/* Table Body */}
      {MOCK_DATA.map((item, index) => (
        <View key={item.id} style={[styles.row, index === MOCK_DATA.length - 1 && styles.lastRow]}>
          <View style={[styles.cell, styles.flex2]}>
            <Text style={styles.cellText}>{item.label}</Text>
          </View>
          <View style={[styles.cell, styles.flex1]}>
            <Text style={styles.cellText}>{item.sem1}</Text>
          </View>
          <View style={[styles.cell, styles.flex1]}>
            <Text style={styles.cellText}>{item.sem2}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#FDE68A', // Amarelo
    borderRadius: 4,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  headerRow: {
    backgroundColor: '#fff', // Branco com texto amarelo
  },
  cell: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    backgroundColor: '#fff',
  },
  flex2: {
    flex: 2,
    alignItems: 'flex-start', // Aspectos alinhados à esquerda
    paddingLeft: 16,
  },
  flex1: {
    flex: 1,
  },
  headerText: {
    fontFamily: 'Roboto_700Bold',
    fontWeight: 'bold',
    color: '#8B7500', // Dourado escuro
    fontSize: 12,
  },
  cellText: {
    fontFamily: 'Roboto_400Regular',
    color: '#8B7500',
    fontSize: 12,
  },
});
