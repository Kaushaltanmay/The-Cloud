import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

/**
 * Generates a clean Base64-encoded PCM 8-bit mono WAV data URI.
 */
function createWavDataUri(sampleRate: number, durationSec: number, generator: (t: number) => number): string {
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

  // Fast standard base64 encoding without Node Buffer
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let base64 = '';
  const total = bytes.length;
  for (let i = 0; i < total; i += 3) {
    const b1 = bytes[i];
    const b2 = i + 1 < total ? bytes[i + 1] : 0;
    const b3 = i + 2 < total ? bytes[i + 2] : 0;
    const trip = (b1 << 16) | (b2 << 8) | b3;
    base64 += chars[(trip >> 18) & 63];
    base64 += chars[(trip >> 12) & 63];
    base64 += i + 1 < total ? chars[(trip >> 6) & 63] : '=';
    base64 += i + 2 < total ? chars[trip & 63] : '=';
  }
  return `data:audio/wav;base64,${base64}`;
}

// 1. Upward synth flap swoop
const FLAP_WAV = createWavDataUri(8000, 0.09, (t) => {
  const freq = 360 + (t / 0.09) * 440;
  const envelope = 1 - t / 0.09;
  return Math.sin(2 * Math.PI * freq * t) * envelope;
});

// 2. High-pitch arcade coin ding
const POINT_WAV = createWavDataUri(8000, 0.16, (t) => {
  const freq = t < 0.07 ? 987 : 1318; // B5 to E6 chime
  const envelope = Math.exp(-t * 12);
  return Math.sin(2 * Math.PI * freq * t) * envelope * 0.9;
});

// 3. Impact crunch
const HIT_WAV = createWavDataUri(8000, 0.14, (t) => {
  const envelope = Math.exp(-t * 22);
  const noise = (Math.random() * 2 - 1) * 0.6;
  const lowBass = Math.sin(2 * Math.PI * 110 * t) * 0.4;
  return (noise + lowBass) * envelope;
});

// 4. Descending Game Over jingle
const GAMEOVER_WAV = createWavDataUri(8000, 0.38, (t) => {
  const freq = Math.max(140, 480 - (t / 0.38) * 320);
  const envelope = Math.exp(-t * 6);
  return Math.sin(2 * Math.PI * freq * t) * envelope;
});

class SoundController {
  private sounds: { [key: string]: Audio.Sound } = {};
  private initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const load = async (uri: string) => {
        const { sound } = await Audio.Sound.createAsync({ uri });
        return sound;
      };

      const [flap, point, hit, over] = await Promise.all([
        load(FLAP_WAV),
        load(POINT_WAV),
        load(HIT_WAV),
        load(GAMEOVER_WAV),
      ]);

      this.sounds = { flap, point, hit, over };
      this.initialized = true;
    } catch (e) {
      console.warn('Audio setup warning:', e);
    }
  }

  async playFlap(soundEnabled: boolean, hapticsEnabled: boolean) {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (!soundEnabled || !this.sounds.flap) return;
    try {
      await this.sounds.flap.replayAsync();
    } catch {}
  }

  async playPoint(soundEnabled: boolean, hapticsEnabled: boolean) {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    if (!soundEnabled || !this.sounds.point) return;
    try {
      await this.sounds.point.replayAsync();
    } catch {}
  }

  async playHit(soundEnabled: boolean, hapticsEnabled: boolean) {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
    if (!soundEnabled || !this.sounds.hit) return;
    try {
      await this.sounds.hit.replayAsync();
    } catch {}
  }

  async playGameOver(soundEnabled: boolean) {
    if (!soundEnabled || !this.sounds.over) return;
    try {
      await this.sounds.over.replayAsync();
    } catch {}
  }

  async cleanup() {
    for (const key of Object.keys(this.sounds)) {
      try {
        await this.sounds[key].unloadAsync();
      } catch {}
    }
    this.sounds = {};
    this.initialized = false;
  }
}

export const SoundService = new SoundController();
