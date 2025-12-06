// Sound Manager for Go Fish game
// Uses percussive thump sounds for card-like effects

class SoundManager {
  constructor() {
    this.soundEnabled = true;
    this.soundVolume = 0.5;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.initialized = true;
  }

  setVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  // Create a short percussive thump - like tapping on a table
  playThump(baseFreq = 120, decay = 0.06) {
    if (!this.soundEnabled || this.soundVolume === 0) return;
    
    try {
      this.init();
      const now = this.audioContext.currentTime;
      
      // Oscillator for low thump
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + decay);
      
      // Noise for texture
      const bufferSize = Math.floor(this.audioContext.sampleRate * decay);
      const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 8);
      }
      const noise = this.audioContext.createBufferSource();
      noise.buffer = noiseBuffer;
      
      // Filters
      const lowpass = this.audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1500;
      
      // Gains
      const oscGain = this.audioContext.createGain();
      const noiseGain = this.audioContext.createGain();
      const masterGain = this.audioContext.createGain();
      
      const vol = this.soundVolume * 0.4;
      oscGain.gain.setValueAtTime(vol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + decay);
      
      noiseGain.gain.setValueAtTime(vol * 0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + decay * 0.7);
      
      masterGain.gain.value = 1;
      
      // Connect
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      
      noise.connect(lowpass);
      lowpass.connect(noiseGain);
      noiseGain.connect(masterGain);
      
      masterGain.connect(this.audioContext.destination);
      
      osc.start(now);
      osc.stop(now + decay);
      noise.start(now);
      noise.stop(now + decay);
    } catch (e) {
      // Ignore
    }
  }

  // Card select - quick tap
  playCardSelect() {
    this.playThump(180, 0.04);
  }

  // Card draw - sliding motion with tap at end
  playCardDraw() {
    if (!this.soundEnabled || this.soundVolume === 0) return;
    
    try {
      this.init();
      const now = this.audioContext.currentTime;
      const duration = 0.1;
      
      // Sliding friction noise
      const bufferSize = Math.floor(this.audioContext.sampleRate * duration);
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        // Bell curve envelope
        const env = Math.sin(Math.PI * t) * Math.exp(-t * 3);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      
      const noise = this.audioContext.createBufferSource();
      noise.buffer = buffer;
      
      const bandpass = this.audioContext.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2000;
      bandpass.Q.value = 0.5;
      
      const gain = this.audioContext.createGain();
      gain.gain.value = this.soundVolume * 0.25;
      
      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.audioContext.destination);
      
      noise.start(now);
      noise.stop(now + duration);
      
      // End with tap
      setTimeout(() => this.playThump(150, 0.03), 70);
    } catch (e) {
      // Ignore
    }
  }

  // Shuffle - series of soft taps with varying pitch
  playShuffle() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playThump(100 + Math.random() * 60, 0.025);
      }, i * 80 + Math.random() * 30);
    }
  }

  // UI click - subtle
  playClick() {
    this.playThump(200, 0.025);
  }

  // Soft tone for notifications
  playTone(frequency, duration, volume = 0.25) {
    if (!this.soundEnabled || this.soundVolume === 0) return;
    
    try {
      this.init();
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const now = this.audioContext.currentTime;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.frequency.value = frequency;
      osc.type = 'triangle';
      
      const vol = this.soundVolume * volume * 0.12;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Ignore
    }
  }

  // Go Fish - descending tones
  playGoFish() {
    this.playTone(400, 0.1, 0.3);
    setTimeout(() => this.playTone(320, 0.14, 0.25), 90);
  }

  // Success - ascending tones
  playSuccess() {
    this.playThump(160, 0.03);
    setTimeout(() => {
      this.playTone(500, 0.07, 0.2);
      setTimeout(() => this.playTone(620, 0.09, 0.18), 60);
    }, 40);
  }

  // Book completed - celebratory
  playBook() {
    this.playTone(420, 0.07, 0.28);
    setTimeout(() => this.playTone(530, 0.07, 0.28), 80);
    setTimeout(() => this.playTone(640, 0.1, 0.32), 160);
  }

  // Game over
  playGameOver() {
    this.playTone(420, 0.18, 0.28);
    setTimeout(() => this.playTone(350, 0.22, 0.24), 180);
  }

  // Win
  playWin() {
    [540, 680, 800].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.14, 0.32), i * 120);
    });
  }

  // Lose
  playLose() {
    this.playTone(380, 0.18, 0.28);
    setTimeout(() => this.playTone(310, 0.22, 0.24), 160);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }
}

const soundManager = new SoundManager();
export default soundManager;
