// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { Mail, Lock, User, Calendar, Activity, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { saveUserProfile } from '../services/dbService';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form profil (untuk register)
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(170);
  const [smoke, setSmoke] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Helper pesan error Firebase yang mudah dimengerti
  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Format email tidak valid.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email atau password salah.';
      case 'auth/email-already-in-use':
        return 'Email ini sudah terdaftar. Silakan login.';
      case 'auth/weak-password':
        return 'Password terlalu lemah (minimal 6 karakter).';
      default:
        return 'Gagal melakukan otentikasi. Silakan coba lagi.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isRegister) {
        // 1. Registrasi Akun baru ke Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Ubah format tanggal lahir ke DD-MM-YYYY
        const parts = birthDate.split('-');
        const formattedBirth = `${parts[2]}-${parts[1]}-${parts[0]}`;

        // 2. Simpan Data Profil ke Cloud Firestore
        await saveUserProfile(uid, {
          name,
          email,
          birthDate: formattedBirth,
          gender,
          weight: Number(weight),
          height: Number(height),
          smoke,
        });
      } else {
        // 1. Login Akun yang sudah ada
        await signInWithEmailAndPassword(auth, email, password);
      }

      onLoginSuccess();
    } catch (err: any) {
      setAuthError(getFriendlyErrorMessage(err.code || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg w-full text-brand-dark font-sans flex items-center justify-center p-4">
      <div className="bg-brand-light w-full max-w-md rounded-3xl p-6 shadow-md border border-white/40">
        
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand-medium text-white rounded-2xl mx-auto flex items-center justify-center mb-2 shadow-xs">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-brand-deep">BP Monitor</h1>
          <p className="text-xs text-brand-dark/80 font-medium mt-1">
            {isRegister ? 'Buat akun baru untuk mulai memantau tensi' : 'Masuk untuk memantau tekanan darah'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-brand-bg p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setAuthError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isRegister ? 'bg-brand-medium text-white shadow-xs' : 'text-brand-dark/70'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setAuthError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isRegister ? 'bg-brand-medium text-white shadow-xs' : 'text-brand-dark/70'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-2xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {isRegister && (
            <div className="bg-brand-bg/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-brand-medium shrink-0" />
              <input
                type="text"
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-brand-dark font-medium"
                required
              />
            </div>
          )}

          <div className="bg-brand-bg/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-brand-medium shrink-0" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-brand-dark font-medium"
              required
            />
          </div>

          <div className="bg-brand-bg/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-sm">
            <Lock className="w-4 h-4 text-brand-medium shrink-0" />
            <input
              type="password"
              placeholder="Password (minimal 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-brand-dark font-medium"
              minLength={6}
              required
            />
          </div>

          {isRegister && (
            <>
              {/* Tanggal Lahir */}
              <div className="bg-brand-bg/80 rounded-2xl px-4 py-2.5 flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-brand-medium shrink-0" />
                <span className="text-xs text-brand-dark/60 shrink-0">Lahir:</span>
                <input
                  type="date"
                  max={today}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-brand-dark font-medium cursor-pointer"
                  required
                />
              </div>

              {/* Gender, Berat & Tinggi */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-brand-bg/80 rounded-2xl px-2 py-2 text-center">
                  <span className="text-[10px] text-brand-dark/60 block">Gender</span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full bg-transparent font-bold text-xs text-brand-dark focus:outline-none text-center cursor-pointer"
                  >
                    <option value="Male">Laki-Laki</option>
                    <option value="Female">Perempuan</option>
                  </select>
                </div>

                <div className="bg-brand-bg/80 rounded-2xl px-2 py-2 text-center">
                  <span className="text-[10px] text-brand-dark/60 block">Berat (Kg)</span>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-transparent font-bold text-xs text-brand-dark text-center focus:outline-none"
                    required
                  />
                </div>

                <div className="bg-brand-bg/80 rounded-2xl px-2 py-2 text-center">
                  <span className="text-[10px] text-brand-dark/60 block">Tinggi (Cm)</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-transparent font-bold text-xs text-brand-dark text-center focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Perokok */}
              <div className="bg-brand-bg/80 rounded-2xl px-4 py-2 flex items-center justify-between text-xs font-semibold">
                <span>Merokok?</span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="authSmoke"
                      checked={smoke === true}
                      onChange={() => setSmoke(true)}
                      className="accent-brand-medium"
                    />
                    Ya
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="authSmoke"
                      checked={smoke === false}
                      onChange={() => setSmoke(false)}
                      className="accent-brand-medium"
                    />
                    Tidak
                  </label>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-medium hover:bg-brand-deep text-white font-bold py-3.5 rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-sm disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isRegister ? 'Daftar Sekarang' : 'Masuk ke Aplikasi'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};