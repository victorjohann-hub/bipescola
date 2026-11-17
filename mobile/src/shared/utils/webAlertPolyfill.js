import { Alert, Platform } from 'react-native';

export function setupWebAlertPolyfill(
  platformOS = Platform.OS,
  alertObj = Alert,
  win = typeof window !== 'undefined' ? window : undefined
) {
  if (platformOS !== 'web' || !win) {
    return;
  }

  alertObj.alert = (title = '', message = '', buttons = []) => {
    const fullText = [title, message].filter(Boolean).join('\n\n');

    if (Array.isArray(buttons) && buttons.length > 1) {
      const cancelBtn =
        buttons.find((b) => b && b.style === 'cancel') || buttons[0];
      const confirmBtn =
        buttons.find((b) => b && b.style !== 'cancel') ||
        buttons[buttons.length - 1];

      const confirmed =
        typeof win.confirm === 'function' ? win.confirm(fullText) : true;

      if (confirmed) {
        if (confirmBtn && typeof confirmBtn.onPress === 'function') {
          confirmBtn.onPress();
        }
      } else if (cancelBtn && typeof cancelBtn.onPress === 'function') {
        cancelBtn.onPress();
      }
      return;
    }

    if (typeof win.alert === 'function') {
      win.alert(fullText);
    }

    if (
      Array.isArray(buttons) &&
      buttons.length === 1 &&
      buttons[0] &&
      typeof buttons[0].onPress === 'function'
    ) {
      buttons[0].onPress();
    }
  };
}

setupWebAlertPolyfill();
