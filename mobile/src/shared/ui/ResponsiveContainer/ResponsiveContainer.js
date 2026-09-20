import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export const ResponsiveContainer = ({ children, style, edges }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width >= 768; // Tablet breakpoint

  return (
    <SafeAreaView 
      style={[styles.outerContainer, style]} 
      edges={edges || ['top', 'left', 'right']}
    >
      <View style={[
        styles.innerContainer, 
        isTablet && styles.tabletContainer,
        {
          // Garantir que não sobreponha a navegação do tablet adicionando o paddingBottom dinâmico + folga
          paddingBottom: Math.max(insets.bottom, 16) + 24,
          // Escala dinamicamente: 85% no tablet normal, no máximo 750px em telas enormes (landscape)
          maxWidth: isTablet ? (width > 900 ? 750 : '85%') : '100%'
        }
      ]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  tabletContainer: {
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        boxShadow: '0px 0px 20px rgba(0,0,0,0.05)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      }
    }),
  }
});
