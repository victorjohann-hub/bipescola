import * as ReactNative from 'react-native';

/**
 * Calcula as métricas responsivas com base nas dimensões da janela.
 * Breakpoints baseados em Material Design 3 Adaptive & iPadOS HIG:
 * - Compact (Phone): width < 768
 * - Medium (Tablet Portrait): 768 <= width < 1024
 * - Expanded (Tablet Landscape / Pro): width >= 1024
 */
export function calculateResponsiveLayout({ width = 375, height = 812 } = {}) {
  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;

  const gridColumns = isLargeTablet ? 3 : isTablet ? 2 : 1;
  const listColumns = isTablet ? 2 : 1;

  const sidebarWidth = isLargeTablet ? 240 : isTablet ? 88 : 0;
  const contentWidth = Math.max(width - sidebarWidth, 320);

  return {
    width,
    height,
    isLandscape,
    isTablet,
    isLargeTablet,
    gridColumns,
    listColumns,
    sidebarWidth,
    contentWidth,
    containerMaxWidth: isLargeTablet ? 1360 : isTablet ? 1024 : '100%',
  };
}

export function useResponsiveLayout(customDimensions) {
  const windowDims = customDimensions || ReactNative.useWindowDimensions();
  const width = customDimensions?.width ?? windowDims.width;
  const height = customDimensions?.height ?? windowDims.height;

  return calculateResponsiveLayout({ width, height });
}
