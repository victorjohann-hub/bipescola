const mockPlay = jest.fn();
const mockSeekTo = jest.fn().mockResolvedValue(undefined);
const mockCreateAudioPlayer = jest.fn(() => ({
  volume: 1.0,
  play: mockPlay,
  seekTo: mockSeekTo,
}));
const mockSetAudioModeAsync = jest.fn().mockResolvedValue(undefined);

jest.mock("expo-audio", () => ({
  createAudioPlayer: (...args) => mockCreateAudioPlayer(...args),
  setAudioModeAsync: (...args) => mockSetAudioModeAsync(...args),
}));

jest.mock("../../../../assets/beep.wav", () => "mock-beep-wav", {
  virtual: true,
});

describe("soundPlayer (playCheckinBeep)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("configura o modo de áudio e reproduz o som de bip em dispositivos nativos", async () => {
    const { playCheckinBeep } = require("../soundPlayer");

    await playCheckinBeep();

    expect(mockSetAudioModeAsync).toHaveBeenCalledWith({
      playsInSilentMode: true,
      interruptionMode: "mixWithOthers",
    });
    expect(mockCreateAudioPlayer).toHaveBeenCalledTimes(1);
    expect(mockPlay).toHaveBeenCalledTimes(1);

    // Segunda chamada deve reutilizar o player existente com seekTo(0)
    await playCheckinBeep();
    expect(mockSeekTo).toHaveBeenCalledWith(0);
    expect(mockPlay).toHaveBeenCalledTimes(2);
  });
});
