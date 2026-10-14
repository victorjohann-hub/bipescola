import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows, spacing } from '@shared/theme';

export const ResponsiveContainer = ({ children, style, edges }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = width >= 768;

  return (
    <SafeAreaView 
      style={[styles.outerContainer, style]} 
      edges={edges || ['top', 'left', 'right']}
    >
      <View style={[
        styles.innerContainer, 
        isTablet && styles.tabletContainer,
        {
          paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.lg,
          maxWidth: isTablet ? (width > 900 ? 760 : '88%') : '100%',
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
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  tabletContainer: {
    backgroundColor: colors.surface,
    ...shadows.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
