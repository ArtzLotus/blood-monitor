// src/pages/ProfilePage.tsx
import React from 'react';
import { User, Home, Mail, Calendar, UserCheck, Scale, Ruler, Cigarette } from 'lucide-react';
import { mockUserProfile } from '../data/dataDummy';

interface ProfilePageProps {
  onNavigate: (page: 'dashboard' | 'history' | 'profile') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-brand-bg w-full text-brand-dark font-sans">
      <div className="max-w-md mx-auto p-4 md:p-8">
        
        {/* Header Navigasi */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-deep">Profile Page</h1>
            <p className="text-sm text-brand-medium font-medium">Change your identity</p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-10 h-10 rounded-full bg-brand-medium text-white flex items-center justify-center shadow-xs hover:bg-brand-deep transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
          </button>
        </header>

        {/* Card Main Container */}
        <div className="bg-brand-light rounded-3xl p-6 shadow-sm mb-6 flex flex-col items-center">
          
          {/* Avatar Icon */}
          <div className="w-28 h-28 rounded-full bg-white border-4 border-brand-medium flex items-center justify-center text-brand-medium mb-6 shadow-inner">
            <User className="w-16 h-16" />
          </div>

          {/* List Input Field Info */}
          <div className="w-full space-y-3">
            
            {/* Nama */}
            <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
              <User className="w-5 h-5 text-brand-medium shrink-0" />
              <span>: {mockUserProfile.name}</span>
            </div>

            {/* Email */}
            <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
              <Mail className="w-5 h-5 text-brand-medium shrink-0" />
              <span>: {mockUserProfile.email}</span>
            </div>

            {/* Tanggal Lahir */}
            <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
              <Calendar className="w-5 h-5 text-brand-medium shrink-0" />
              <span>: {mockUserProfile.birthDate}</span>
            </div>

            {/* Gender */}
            <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
              <UserCheck className="w-5 h-5 text-brand-medium shrink-0" />
              <span>: {mockUserProfile.gender}</span>
            </div>

            {/* Berat Badan */}
            <div className="bg-brand-bg/80 rounded-2xl overflow-hidden flex items-center justify-between text-brand-dark font-medium text-sm pl-4">
            <div className="flex items-center gap-3 py-3">
                <Scale className="w-5 h-5 text-brand-medium shrink-0" />
                <span>: {mockUserProfile.weight}</span>
            </div>
            <span className="bg-brand-medium text-white w-16 flex items-center justify-center font-bold text-xs uppercase self-stretch rounded-r-2xl shrink-0">
                Kg
            </span>
            </div>

            {/* Tinggi Badan */}
            <div className="bg-brand-bg/80 rounded-2xl overflow-hidden flex items-center justify-between text-brand-dark font-medium text-sm pl-4">
            <div className="flex items-center gap-3 py-3">
                <Ruler className="w-5 h-5 text-brand-medium shrink-0" />
                <span>: {mockUserProfile.height}</span>
            </div>
            <span className="bg-brand-medium text-white w-16 flex items-center justify-center font-bold text-xs uppercase self-stretch rounded-r-2xl shrink-0">
                Cm
            </span>
            </div>

            {/* Perokok */}
            <div className="bg-brand-bg/80 rounded-2xl px-4 py-3 flex items-center gap-3 text-brand-dark font-medium text-sm">
              <Cigarette className="w-5 h-5 text-brand-medium shrink-0" />
              <span>: {mockUserProfile.smoke ? 'Yes' : 'No'}</span>
            </div>

          </div>
        </div>

        {/* Tombol Back to Home */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full bg-brand-light hover:bg-brand-medium text-white font-extrabold text-xl py-4 rounded-3xl shadow-md transition-all cursor-pointer border-2 border-white/30"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
};