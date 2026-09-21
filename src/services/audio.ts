import { File, Paths } from 'expo-file-system';

let createAudioPlayer: any = null;
let setAudioModeAsync: any = null;
try {
  const expoAudio = require('expo-audio');
  createAudioPlayer = expoAudio.createAudioPlayer;
  setAudioModeAsync = expoAudio.setAudioModeAsync;
} catch (e) {
  console.warn('expo-audio not available', e);
}

let HapticsModule: any = null;
try {
  HapticsModule = require('expo-haptics');
} catch {}

/**
 * Generates a clean PCM 8-bit mono WAV Uint8Array.
 */
function createWavBytes(sampleRate: number, durationSec: number, generator: (t: number) => number): Uint8Array {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples;
  const bufferSize = 44 + dataSize;
  const bytes = new Uint8Array(bufferSize);

  // RIFF header
  bytes[0] = 0x52; bytes[1] = 0x49; bytes[2] = 0x46; bytes[3] = 0x46; // "RIFF"
  const fileLen = bufferSize - 8;
  bytes[4] = fileLen & 0xff;
  bytes[5] = (fileLen >> 8) & 0xff;
  bytes[6] = (fileLen >> 16) & 0xff;
  bytes[7] = (fileLen >> 24) & 0xff;
  bytes[8] = 0x57; bytes[9] = 0x41; bytes[10] = 0x56; bytes[11] = 0x45; // "WAVE"

  // fmt subchunk
  bytes[12] = 0x66; bytes[13] = 0x6d; bytes[14] = 0x74; bytes[15] = 0x20; // "fmt "
  bytes[16] = 16; bytes[17] = 0; bytes[18] = 0; bytes[19] = 0; // 16 for PCM
  bytes[20] = 1; bytes[21] = 0; // AudioFormat 1 = PCM
  bytes[22] = 1; bytes[23] = 0; // 1 channel (mono)
  bytes[24] = sampleRate & 0xff;
  bytes[25] = (sampleRate >> 8) & 0xff;
  bytes[26] = (sampleRate >> 16) & 0xff;
  bytes[27] = (sampleRate >> 24) & 0xff;
  // ByteRate = SampleRate * NumChannels * BitsPerSample/8 = sampleRate * 1
  bytes[28] = bytes[24]; bytes[29] = bytes[25]; bytes[30] = bytes[26]; bytes[31] = bytes[27];
  bytes[32] = 1; bytes[33] = 0; // BlockAlign = 1
  bytes[34] = 8; bytes[35] = 0; // BitsPerSample = 8

  // data subchunk
  bytes[36] = 0x64; bytes[37] = 0x61; bytes[38] = 0x74; bytes[39] = 0x61; // "data"
  bytes[40] = dataSize & 0xff;
  bytes[41] = (dataSize >> 8) & 0xff;
  bytes[42] = (dataSize >> 16) & 0xff;
  bytes[43] = (dataSize >> 24) & 0xff;

  // Generate samples (8-bit unsigned: 128 is center/silence)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generator(t)));
    bytes[44 + i] = Math.floor((sample + 1) * 127.5);
  }

  return bytes;
}

// 1. Upward synth flap swoop
const FLAP_BYTES = createWavBytes(8000, 0.09, (t) => {
  const freq = 360 + (t / 0.09) * 440;
  const envelope = 1 - t / 0.09;
  return Math.sin(2 * Math.PI * freq * t) * envelope;
});

// 2. High-pitch arcade coin ding
const POINT_BYTES = createWavBytes(8000, 0.16, (t) => {
  const freq = t < 0.07 ? 987 : 1318; // B5 to E6 chime
  const envelope = Math.exp(-t * 12);
  return Math.sin(2 * Math.PI * freq * t) * envelope * 0.9;
});

// 3. Impact crunch
const HIT_BYTES = createWavBytes(8000, 0.14, (t) => {
  const envelope = Math.exp(-t * 22);
  const noise = (Math.random() * 2 - 1) * 0.6;
  const lowBass = Math.sin(2 * Math.PI * 110 * t) * 0.4;
  return (noise + lowBass) * envelope;
});

// 4. Descending Game Over jingle
const GAMEOVER_BYTES = createWavBytes(8000, 0.38, (t) => {
  const freq = Math.max(140, 480 - (t / 0.38) * 320);
  const envelope = Math.exp(-t * 6);
  return Math.sin(2 * Math.PI * freq * t) * envelope;
});

class SoundController {
  private sounds: { [key: string]: any } = {};
  private initialized = false;

  async init() {
    if (this.initialized || !createAudioPlayer) return;
    try {
      if (setAudioModeAsync) {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
        }).catch(() => {});
      }

      const saveWav = (filename: string, bytes: Uint8Array) => {
        try {
          const file = new File(Paths.cache, filename);
          file.write(bytes);
          return file.uri;
        } catch {
          return null;
        }
      };

      const flapUri = saveWav('flap.wav', FLAP_BYTES);
      const pointUri = saveWav('point.wav', POINT_BYTES);
      const hitUri = saveWav('hit.wav', HIT_BYTES);
      const overUri = saveWav('over.wav', GAMEOVER_BYTES);

      const flap = flapUri ? createAudioPlayer({ uri: flapUri }) : null;
      const point = pointUri ? createAudioPlayer({ uri: pointUri }) : null;
      const hit = hitUri ? createAudioPlayer({ uri: hitUri }) : null;
      const over = overUri ? createAudioPlayer({ uri: overUri }) : null;

      this.sounds = { flap, point, hit, over };
      this.initialized = true;
    } catch (e) {
      console.warn('Audio setup warning:', e);
    }
  }

  async playFlap(soundEnabled: boolean, hapticsEnabled: boolean) {
    if (hapticsEnabled && HapticsModule) {
      try {
        HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle?.Light).catch(() => {});
      } catch {}
    }
    if (!soundEnabled || !this.sounds.flap) return;
    try {
      this.sounds.flap.seekTo(0).catch(() => {});
      this.sounds.flap.play();
    } catch {}
  }

  async playPoint(soundEnabled: boolean, hapticsEnabled: boolean) {
    if (hapticsEnabled && HapticsModule) {
      try {
        HapticsModule.notificationAsync(HapticsModule.NotificationFeedbackType?.Success).catch(() => {});
      } catch {}
    }
    if (!soundEnabled || !this.sounds.point) return;
    try {
      this.sounds.point.seekTo(0).catch(() => {});
      this.sounds.point.play();
    } catch {}
  }

  async playHit(soundEnabled: boolean, hapticsEnabled: boolean) {
    if (hapticsEnabled && HapticsModule) {
      try {
        HapticsModule.notificationAsync(HapticsModule.NotificationFeedbackType?.Error).catch(() => {});
      } catch {}
    }
    if (!soundEnabled || !this.sounds.hit) return;
    try {
      this.sounds.hit.seekTo(0).catch(() => {});
      this.sounds.hit.play();
    } catch {}
  }

  async playGameOver(soundEnabled: boolean) {
    if (!soundEnabled || !this.sounds.over) return;
    try {
      this.sounds.over.seekTo(0).catch(() => {});
      this.sounds.over.play();
    } catch {}
  }

  async cleanup() {
    for (const key of Object.keys(this.sounds)) {
      try {
        this.sounds[key]?.remove?.();
      } catch {}
    }
    this.sounds = {};
    this.initialized = false;
  }
}

export const SoundService = new SoundController();
