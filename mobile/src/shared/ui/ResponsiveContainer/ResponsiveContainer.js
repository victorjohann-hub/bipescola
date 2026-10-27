import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@shared/theme';
import { useResponsiveLayout } from '@shared/hooks/useResponsiveLayout';

export const ResponsiveContainer = ({ children, style, contentStyle, edges, fullBleed = false }) => {
  const { isTablet, isLargeTablet, containerMaxWidth } = useResponsiveLayout();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[styles.outerContainer, style]}
      edges={edges || ['top', 'left', 'right']}
    >
      <View
        style={[
          styles.innerContainer,
          isTablet && !fullBleed && styles.tabletContainer,
          {
            // No tablet a navegação é lateral (Navigation Rail / Sidebar), então não precisa de padding extra de BottomTab
            paddingBottom: isTablet ? Math.max(insets.bottom, spacing.md) : Math.max(insets.bottom, spacing.md) + spacing.lg,
            maxWidth: fullBleed ? '100%' : containerMaxWidth,
            paddingHorizontal: isLargeTablet && !fullBleed ? spacing.lg : 0,
          },
          contentStyle,
        ]}
      >
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
    backgroundColor: colors.background,
  },
});
