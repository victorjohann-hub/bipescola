import {
  useResponsiveLayout,
  calculateResponsiveLayout,
} from '../useResponsiveLayout';

describe('useResponsiveLayout & calculateResponsiveLayout', () => {
  it('deve identificar Smartphone Compact (< 768px) com 1 coluna e sem sidebar', () => {
    const layout = calculateResponsiveLayout({ width: 390, height: 844 });
    expect(layout.isTablet).toBe(false);
    expect(layout.isLargeTablet).toBe(false);
    expect(layout.isLandscape).toBe(false);
    expect(layout.gridColumns).toBe(1);
    expect(layout.listColumns).toBe(1);
    expect(layout.sidebarWidth).toBe(0);
    expect(layout.containerMaxWidth).toBe('100%');
  });

  it('deve identificar Tablet Retrato (768px - 1023px) com Navigation Rail (88px) e 2 colunas', () => {
    const layout = calculateResponsiveLayout({ width: 820, height: 1180 });
    expect(layout.isTablet).toBe(true);
    expect(layout.isLargeTablet).toBe(false);
    expect(layout.isLandscape).toBe(false);
    expect(layout.gridColumns).toBe(2);
    expect(layout.listColumns).toBe(2);
    expect(layout.sidebarWidth).toBe(88);
    expect(layout.contentWidth).toBe(820 - 88);
    expect(layout.containerMaxWidth).toBe(1024);
  });

  it('deve identificar Tablet Paisagem / Pro (>= 1024px) com Sidebar Expandida (240px) e 3 colunas de grid', () => {
    const layout = calculateResponsiveLayout({ width: 1180, height: 820 });
    expect(layout.isTablet).toBe(true);
    expect(layout.isLargeTablet).toBe(true);
    expect(layout.isLandscape).toBe(true);
    expect(layout.gridColumns).toBe(3);
    expect(layout.listColumns).toBe(2);
    expect(layout.sidebarWidth).toBe(240);
    expect(layout.contentWidth).toBe(1180 - 240);
    expect(layout.containerMaxWidth).toBe(1360);
  });

  it('deve resolver corretamente via useResponsiveLayout passando dimensões customizadas', () => {
    const layout = useResponsiveLayout({ width: 1366, height: 1024 });
    expect(layout.isTablet).toBe(true);
    expect(layout.isLargeTablet).toBe(true);
    expect(layout.isLandscape).toBe(true);
    expect(layout.gridColumns).toBe(3);
  });
});
