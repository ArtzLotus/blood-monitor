// src/pages/Profile.tsx
import React, { useState } from 'react';
import { User, Home, Mail, Calendar, UserCheck, Scale, Ruler, Cigarette, Edit3, Check, X } from 'lucide-react';
import { mockUserProfile } from '../data/dataDummy';

interface ProfilePageProps {
  onNavigate: (page: 'dashboard' | 'history' | 'profile') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  // State untuk mode edit dan data profile
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockUserProfile);
  const [tempProfile, setTempProfile] = useState(mockUserProfile);
  const today = new Date().toISOString().split('T')[0];

  const handleStartEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(tempProfile);
    // Update juga variabel mock agar konsisten saat dipakai fitur lain
    mockUserProfile.name = tempProfile.name;
    mockUserProfile.email = tempProfile.email;
    mockUserProfile.birthDate = tempProfile.birthDate;
    mockUserProfile.gender = tempProfile.gender;
    mockUserProfile.weight = Number(tempProfile.weight);
    mockUserProfile.height = Number(tempProfile.height);
    mockUserProfile.smoke = tempProfile.smoke;

    setIsEditing(false);
  };

  const toInputDateFormat = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return '';
    const parts = dateStr.split('-');
    if (parts[0].length === 4) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  const toDisplayDateFormat = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts[0].length === 2) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
                onClick={handleStartEdit}
                className="w-10 h-10 rounded-full bg-white text-brand-medium flex items-center justify-center shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                title="Edit Profile"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 rounded-full bg-brand-medium text-white flex items-center justify-center shadow-xs hover:bg-brand-deep transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Card Main Container */}
        <form onSubmit={handleSaveProfile}>
          <div className="bg-brand-light rounded-3xl p-6 shadow-sm mb-6 flex flex-col items-center">
            
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
                {isEditing ? (
                  <input
                    type="email"
                    value={tempProfile.email}
                    onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-brand-dark font-bold border-b border-brand-medium/30 focus:border-brand-medium px-1"
                    required
                  />
                ) : (
                  <span>{profile.email}</span>
                )}
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
                    onChange={(e) => setTempProfile({ ...tempProfile, birthDate: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-brand-dark font-bold border-b border-brand-medium/30 focus:border-brand-medium px-1"
                    required
                  />
                ) : (
                  <span>{toDisplayDateFormat(profile.birthDate)}</span>
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
                className="w-full bg-slate-300 hover:bg-slate-400 text-brand-dark font-extrabold text-base py-4 rounded-3xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-base py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/30 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Save Profile
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-xl py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/30"
            >
              Back to Home
            </button>
          )}
        </form>

      </div>
    </div>
  );
};