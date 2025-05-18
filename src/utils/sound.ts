class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement>;
  private isMuted: boolean;

  private constructor() {
    this.sounds = new Map();
    this.isMuted = false;
    this.loadSounds();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private loadSounds() {
    // 预加载音效
    const soundFiles = {
      click: '/sounds/click.mp3',
      success: '/sounds/success.mp3',
      background: '/sounds/background.mp3',
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  public play(soundName: string) {
    if (this.isMuted) return;

    const sound = this.sounds.get(soundName);
    if (sound) {
      // 如果是背景音乐，循环播放
      if (soundName === 'background') {
        sound.loop = true;
      }
      
      // 重置音频并播放
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn('播放音效失败:', error);
      });
    }
  }

  public stop(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.sounds.forEach(sound => sound.pause());
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}

export const soundManager = SoundManager.getInstance(); 