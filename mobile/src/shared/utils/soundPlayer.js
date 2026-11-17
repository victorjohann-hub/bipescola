import { Platform } from "react-native";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

const beepAsset = require("../../../assets/beep.wav");

let nativePlayer = null;
let audioModeConfigured = false;
let webAudioCtx = null;

/**
 * Toca o som de "Bip" na Web utilizando Web Audio API (baixa latência, sem bloqueio de rede).
 */
const playWebBeep = () => {
  if (typeof window === "undefined") return false;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  if (!webAudioCtx) {
    webAudioCtx = new AudioContextClass();
  }
  if (webAudioCtx.state === "suspended") {
    webAudioCtx.resume();
  }

  const now = webAudioCtx.currentTime;

  // Primeiro tom (1200 Hz - 80ms)
  const osc1 = webAudioCtx.createOscillator();
  const gain1 = webAudioCtx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1200, now);
  gain1.gain.setValueAtTime(0.01, now);
  gain1.gain.linearRampToValueAtTime(0.35, now + 0.008);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc1.connect(gain1);
  gain1.connect(webAudioCtx.destination);
  osc1.start(now);
  osc1.stop(now + 0.08);

  // Segundo tom de confirmação (1800 Hz - 160ms)
  const osc2 = webAudioCtx.createOscillator();
  const gain2 = webAudioCtx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1800, now + 0.08);
  gain2.gain.setValueAtTime(0.01, now + 0.08);
  gain2.gain.linearRampToValueAtTime(0.4, now + 0.09);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
  osc2.connect(gain2);
  gain2.connect(webAudioCtx.destination);
  osc2.start(now + 0.08);
  osc2.stop(now + 0.24);

  return true;
};

/**
 * Reproduz o som característico de "Bip" ao realizar o check-in de um aluno.
 * Funciona tanto em dispositivos nativos (iOS/Android via expo-audio) quanto no navegador (Web Audio API).
 */
export const playCheckinBeep = async () => {
  try {
    if (Platform.OS === "web" && playWebBeep()) {
      return;
    }

    if (!audioModeConfigured) {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionMode: "mixWithOthers",
      });
      audioModeConfigured = true;
    }

    if (!nativePlayer) {
      nativePlayer = createAudioPlayer(beepAsset);
      nativePlayer.volume = 1.0;
    } else {
      await nativePlayer.seekTo(0);
    }

    nativePlayer.play();
  } catch (error) {
    // Falha silenciosa de áudio para nunca interromper o fluxo de presença
    console.warn("Aviso ao reproduzir som de bip:", error?.message || error);
  }
};
