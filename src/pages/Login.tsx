import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { playVoiceInstruction, stopVoiceInstruction } from '../utils/speech';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'bn' | 'en'>('bn');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const navigate = useNavigate();
  const initialTriggerRef = useRef(false);

  // Determine message for speech
  const getVoiceText = useCallback((isSignUpMode: boolean, lang: 'bn' | 'en') => {
    if (lang === 'bn') {
      return isSignUpMode
        ? 'নতুন একাউন্ট খুলতে আপনার নাম, ইমেইল এবং পাসওয়ার্ড দিয়ে সাইন আপ করুন।'
        : 'আরডি টেক্সটাইলে লগইন করতে অনুগ্রহ করে আপনার ইমেইল এবং পাসওয়ার্ড দিন।';
    } else {
      return isSignUpMode
        ? 'Please enter your name, email and password to create an account.'
        : 'Please enter your email and password to sign in.';
    }
  }, []);

  const triggerVoicePrompt = useCallback((isSignUpMode: boolean, lang: 'bn' | 'en' = voiceLang) => {
    if (!voiceEnabled) return;
    const textToSpeak = getVoiceText(isSignUpMode, lang);
    setIsSpeaking(true);
    playVoiceInstruction(textToSpeak, lang, () => {
      setIsSpeaking(false);
    });
  }, [voiceEnabled, voiceLang, getVoiceText]);

  // Voice guidance on component mount
  useEffect(() => {
    // Attempt voice prompt after a short delay so voices are loaded
    const timer = setTimeout(() => {
      if (!initialTriggerRef.current) {
        initialTriggerRef.current = true;
        triggerVoicePrompt(isSignUp, voiceLang);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      stopVoiceInstruction();
    };
  }, [triggerVoicePrompt, isSignUp, voiceLang]);

  // Toggle mode & speak
  const handleToggleMode = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setError('');
    triggerVoicePrompt(signUpMode, voiceLang);
  };

  const handleLanguageChange = (newLang: 'bn' | 'en') => {
    setVoiceLang(newLang);
    triggerVoicePrompt(isSignUp, newLang);
  };

  const toggleSound = () => {
    if (isSpeaking) {
      stopVoiceInstruction();
      setIsSpeaking(false);
    } else {
      setVoiceEnabled(true);
      triggerVoicePrompt(isSignUp, voiceLang);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Ensure user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          name: result.user.displayName,
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      }
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          name: name || email.split('@')[0],
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(isSignUp ? 'Failed to create an account' : 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl border border-stone-200 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-lg bg-stone-950 mb-3 p-0.5">
            <img 
              src="./logo.png" 
              alt="R.D TEXTILE" 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden w-full h-full bg-amber-500 rounded-full flex items-center justify-center text-white font-serif font-bold text-3xl shadow-md">
              RD
            </div>
          </div>
          <h2 className="text-center text-3xl font-serif text-stone-900">
            {isSignUp ? 'Join R.D TEXTILE' : 'Welcome to R.D TEXTILE'}
          </h2>
          <p className="mt-1 text-center text-xs uppercase tracking-widest text-amber-700 font-bold">
            Ripan Saree Center
          </p>
          <p className="mt-2 text-center text-sm text-stone-600">
            {isSignUp ? 'Create an account for exclusive collections & order tracking' : 'Sign in to access your profile, orders, and wishlist'}
          </p>
        </div>

        {/* Mode Toggle Tabs (Sign In / Sign Up) */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            type="button"
            onClick={() => handleToggleMode(false)}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              !isSignUp
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In / লগইন
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode(true)}
            className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              isSignUp
                ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign Up / সাইন আপ
          </button>
        </div>

        {/* Voice Assistance Bar */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-full transition-all shrink-0 ${
                isSpeaking
                  ? 'bg-amber-500 text-white animate-pulse ring-4 ring-amber-400/30 shadow-md'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
              title={isSpeaking ? 'Stop voice' : 'Play voice guidance'}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="text-left overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  ভয়েস গাইড (Voice Guide)
                </span>
                {isSpeaking && (
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <p className="text-xs text-amber-950 font-medium truncate">
                {voiceLang === 'bn'
                  ? (isSignUp ? 'নাম, ইমেইল এবং পাসওয়ার্ড দিয়ে সাইন আপ করুন' : 'ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন')
                  : (isSignUp ? 'Enter name, email & password to sign up' : 'Enter email & password to sign in')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Replay voice button */}
            <button
              type="button"
              onClick={() => triggerVoicePrompt(isSignUp, voiceLang)}
              className="p-1.5 rounded-lg text-amber-800 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="শুনুন / Replay voice"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-[11px]">শুনুন</span>
            </button>
            {/* Language switcher button */}
            <button
              type="button"
              onClick={() => handleLanguageChange(voiceLang === 'bn' ? 'en' : 'bn')}
              className="px-2 py-1 rounded-md bg-white border border-amber-200 text-[10px] font-bold text-amber-800 hover:bg-amber-100 transition-colors"
              title="Change Voice Language"
            >
              {voiceLang === 'bn' ? 'EN' : 'বাংলা'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-stone-300 placeholder-stone-500 text-stone-900 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-stone-900 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-900 disabled:opacity-70"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <button 
              type="button"
              onClick={() => handleToggleMode(!isSignUp)}
              className="text-amber-600 hover:text-amber-500 font-medium"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-stone-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-stone-300 rounded-md shadow-sm bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <svg className="h-5 w-5 mr-2" aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
