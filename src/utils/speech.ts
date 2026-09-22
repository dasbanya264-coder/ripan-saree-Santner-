// Voice assistance utility using Web Speech API

export interface VoiceGuideOptions {
  text: string;
  lang?: 'bn-IN' | 'bn-BD' | 'en-US' | 'en-IN';
  rate?: number;
  pitch?: number;
}

export function playVoiceInstruction(
  text: string,
  preferredLang: 'bn' | 'en' = 'en',
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for clear understanding
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();

    if (preferredLang === 'bn') {
      const bnVoice = voices.find(v => v.lang.toLowerCase().includes('bn'));
      if (bnVoice) {
        utterance.voice = bnVoice;
        utterance.lang = bnVoice.lang;
      } else {
        // Fallback to English voice if Bengali speech engine isn't installed
        const enVoice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
        utterance.lang = 'en-US';
      }
    } else {
      const enVoice = voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-US') || v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopVoiceInstruction(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}
