import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechHookResult {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  clearError: () => void;
  audioData: Uint8Array;
  error: string | null;
}

export const useSpeechRecognition = (): SpeechHookResult => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';
        let maxConf = 0;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
            maxConf = Math.max(maxConf, event.results[i][0].confidence);
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        setTranscript(prev => prev + finalTrans);
        setInterimTranscript(interimTrans);
        if (maxConf > 0) setConfidence(Math.round(maxConf * 100));
      };

      recognitionRef.current.onerror = (event: any) => {
        // Handle "no-speech" silently, it just means silence
        if (event.error === 'no-speech') {
           return;
        }
        
        console.warn("Speech recognition error:", event.error);
        
        // Map browser errors to user-friendly messages
        let errorMessage = event.error;
        if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Using text mode.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error. Check connection.';
        }
        
        setError(errorMessage);
        stopListening();
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
           setIsListening(false);
           stopAudioVisualizer();
        }
      };
    } else {
      setError("Speech recognition not supported in this browser.");
    }

    return () => {
      stopListening();
    };
  }, []);

  const startAudioVisualizer = async () => {
    try {
      // Check for API support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return; // Silently fail if not supported
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; 
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioData(new Uint8Array(dataArray)); 
        rafRef.current = requestAnimationFrame(update);
      };

      update();
    } catch (e) {
      // Silently catch visualizer errors (e.g. permission denied just for audio data)
      // We don't want this to stop the text recognition if that is working separately
      // or if we just want to degrade gracefully without an error popup.
      console.log("Audio visualizer skipped:", e);
    }
  };

  const stopAudioVisualizer = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    try { sourceRef.current?.disconnect(); } catch (e) {}
    try { analyserRef.current?.disconnect(); } catch (e) {}
    try { audioContextRef.current?.close(); } catch (e) {}

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setAudioData(new Uint8Array(0));
  };

  const startListening = useCallback(() => {
    setError(null);
    setTranscript(''); 
    setInterimTranscript(''); 
    
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized.");
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      startAudioVisualizer();
    } catch (e) {
      // This usually happens if start is called while already started
      // or if permissions are permanently blocked
      console.error("Speech recognition start error:", e);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
    stopAudioVisualizer();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    confidence,
    startListening,
    stopListening,
    clearError,
    audioData,
    error
  };
};