// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { User, Home, Mail, Calendar, UserCheck, Scale, Ruler, Cigarette, Edit3, Check, X, LogOut, Loader2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserProfile, saveUserProfile, type UserProfileData } from '../services/dbService';

interface ProfilePageProps {
  onNavigate: (page: 'dashboard' | 'history' | 'profile') => void;
}

const defaultProfile: UserProfileData = {
  name: 'User',
  email: '',
  birthDate: '01-01-2000',
  gender: 'Male',
  weight: 60,
  height: 170,
  smoke: false,
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfileData>(defaultProfile);
  const [tempProfile, setTempProfile] = useState<UserProfileData>(defaultProfile);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
          setTempProfile(data);
        } else {
          const initData: UserProfileData = {
            ...defaultProfile,
            email: user.email || '',
          };
          setProfile(initData);
          setTempProfile(initData);
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  const handleStartEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      await saveUserProfile(user.uid, tempProfile);
      setProfile(tempProfile);
    }
    setIsEditing(false);
  };

  const toInputDateFormat = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return '';
    const parts = dateStr.split('-');
    if (parts[0].length === 4) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const toDisplayDateFormat = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts[0].length === 2) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onNavigate('dashboard');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-medium" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg w-full text-brand-dark font-sans">
      <div className="max-w-md mx-auto p-4 md:p-8">
        
        {/* Header Navigasi */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-deep">Profile Page</h1>
            <p className="text-sm text-brand-medium font-medium">
              {isEditing ? 'Update your identity' : 'Change your identity'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="w-10 h-10 rounded-full bg-white text-brand-medium flex items-center justify-center shadow-xs hover:bg-white/80 transition-colors cursor-pointer"
                title="Edit Profile"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 rounded-full bg-brand-medium text-white flex items-center justify-center shadow-xs hover:bg-brand-deep transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Card Main Container & Form */}
        <form onSubmit={handleSaveProfile}>
          <div className="bg-brand-light rounded-3xl p-6 shadow-sm mb-6 flex flex-col items-center border border-white/40">
            
            {/* Avatar Icon */}
            <div className="w-28 h-28 rounded-full bg-white border-4 border-brand-medium flex items-center justify-center text-brand-medium mb-6 shadow-inner relative">
              <User className="w-16 h-16" />
            </div>

            {/* List Field Info / Form Input */}
            <div className="w-full space-y-3">
              
              {/* Nama */}
              <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
                <User className="w-5 h-5 text-brand-medium shrink-0" />
                <span className="text-brand-dark/70 font-semibold">:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-brand-dark font-bold border-b border-brand-medium/30 focus:border-brand-medium px-1"
                    required
                  />
                ) : (
                  <span>{profile.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
                <Mail className="w-5 h-5 text-brand-medium shrink-0" />
                <span className="text-brand-dark/70 font-semibold">:</span>
                <span className="text-brand-dark/80">{profile.email}</span>
              </div>

              {/* Tanggal Lahir */}
              <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
                <Calendar className="w-5 h-5 text-brand-medium shrink-0" />
                <span className="text-brand-dark/70 font-semibold">:</span>
                {isEditing ? (
                  <input
                    type="date"
                    max={today}
                    value={toInputDateFormat(tempProfile.birthDate)}
                    onChange={(e) =>
                      setTempProfile({
                        ...tempProfile,
                        birthDate: toDisplayDateFormat(e.target.value),
                      })
                    }
                    className="w-full bg-transparent focus:outline-none text-brand-dark font-bold border-b border-brand-medium/30 focus:border-brand-medium px-1 cursor-pointer"
                    required
                  />
                ) : (
                  <span>{profile.birthDate}</span>
                )}
              </div>

              {/* Gender */}
              <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
                <UserCheck className="w-5 h-5 text-brand-medium shrink-0" />
                <span className="text-brand-dark/70 font-semibold">:</span>
                {isEditing ? (
                  <select
                    value={tempProfile.gender}
                    onChange={(e) => setTempProfile({ ...tempProfile, gender: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-brand-dark font-bold border-b border-brand-medium/30 focus:border-brand-medium px-1 cursor-pointer"
                  >
                    <option value="Male" className="text-brand-dark">Male</option>
                    <option value="Female" className="text-brand-dark">Female</option>
                  </select>
                ) : (
                  <span>{profile.gender}</span>
                )}
              </div>

              {/* Berat Badan */}
              <div className="bg-brand-bg/80 rounded-2xl overflow-hidden flex items-center justify-between text-brand-dark font-medium text-sm pl-4">
                <div className="flex items-center gap-3 py-3 w-full mr-2">
                  <Scale className="w-5 h-5 text-brand-medium shrink-0" />
                  <span className="text-brand-dark/70 font-semibold">:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempProfile.weight}
                      onChange={(e) => setTempProfile({ ...tempProfile, weight: Number(e.target.value) })}
                      className="w-full bg-transparent focus:outline-none text-brand-dark font-bold border-b border-brand-medium/30 focus:border-brand-medium px-1"
                      required
                    />
                  ) : (
                    <span>{profile.weight}</span>
                  )}
                </div>
                <span className="bg-brand-medium text-white w-16 flex items-center justify-center font-bold text-xs uppercase self-stretch rounded-r-2xl shrink-0">
                  Kg
                </span>
              </div>

              {/* Tinggi Badan */}
              <div className="bg-brand-bg/80 rounded-2xl overflow-hidden flex items-center justify-between text-brand-dark font-medium text-sm pl-4">
                <div className="flex items-center gap-3 py-3 w-full mr-2">
                  <Ruler className="w-5 h-5 text-brand-medium shrink-0" />
                  <span className="text-brand-dark/70 font-semibold">:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempProfile.height}
                      onChange={(e) => setTempProfile({ ...tempProfile, height: Number(e.target.value) })}
                      className="w-full bg-transparent focus:outline-none text-brand-dark font-bold border-b border-brand-medium/30 focus:border-brand-medium px-1"
                      required
                    />
                  ) : (
                    <span>{profile.height}</span>
                  )}
                </div>
                <span className="bg-brand-medium text-white w-16 flex items-center justify-center font-bold text-xs uppercase self-stretch rounded-r-2xl shrink-0">
                  Cm
                </span>
              </div>

              {/* Perokok */}
              <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
                <Cigarette className="w-5 h-5 text-brand-medium shrink-0" />
                <span className="text-brand-dark/70 font-semibold">:</span>
                {isEditing ? (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="smoke"
                        checked={tempProfile.smoke === true}
                        onChange={() => setTempProfile({ ...tempProfile, smoke: true })}
                        className="accent-brand-medium"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                      <input
                        type="radio"
                        name="smoke"
                        checked={tempProfile.smoke === false}
                        onChange={() => setTempProfile({ ...tempProfile, smoke: false })}
                        className="accent-brand-medium"
                      />
                      No
                    </label>
                  </div>
                ) : (
                  <span>{profile.smoke ? 'Yes' : 'No'}</span>
                )}
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          {isEditing ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-white/80 hover:bg-white text-brand-dark font-extrabold text-base py-4 rounded-3xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/40"
              >
                <X className="w-5 h-5" /> Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-brand-medium hover:bg-brand-deep text-white font-extrabold text-base py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/30 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Save Profile
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-xl py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/30"
              >
                Back to Home
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-brand-deep hover:bg-brand-dark text-white font-bold text-sm py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm border border-white/20"
              >
                <LogOut className="w-4 h-4" /> Keluar Akun (Logout)
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};