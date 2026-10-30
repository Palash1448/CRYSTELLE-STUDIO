import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  loginAdminWithFirebase,
  registerAdminWithFirebase,
  saveStoredAdminSession,
  AdminSession,
} from '@/lib/admin-auth';

interface AdminLoginPageProps {
  onLoginSuccess: (session: AdminSession) => void;
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid administrator email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (isRegisterMode) {
        result = await registerAdminWithFirebase(cleanEmail, password);
      } else {
        result = await loginAdminWithFirebase(cleanEmail, password);
      }

      if (result.success && result.session) {
        saveStoredAdminSession(result.session);
        setLoginSuccess(true);
        setTimeout(() => {
          if (result.session) {
            onLoginSuccess(result.session);
          }
        }, 150);
      } else {
        setIsLoading(false);
        setError(
          result.error ||
            'Authentication failed. Please verify your administrator credentials.'
        );
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C1917] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#C59A44]/20 selection:text-[#9A7228]">
      {/* Background Lighting & Ambiance (Light Theme) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-137.5 bg-[#C59A44]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full border border-[#D4A359]/50 overflow-hidden bg-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <img
              src="/crystelle-gold-logo.png"
              alt="Crystelle Studio"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold tracking-wide text-[#1C1917]">
              Crystelle
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#A67C2E]">
              Studio
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs text-[#78716C] hover:text-[#1C1917] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE4DC] bg-white shadow-2xs hover:bg-[#FAF8F5]"
        >
          <span>← Back to Shop</span>
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-[#EAE4DC] rounded-3xl p-6 sm:p-9 shadow-xl shadow-stone-200/50 space-y-5">
          {/* Card Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FAF5EB] border border-[#E3D7C5] text-[#A67C2E] shadow-2xs mb-2">
              <LockKeyhole className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1C1917]">
              Admin Portal
            </h1>
            <p className="text-xs text-[#78716C] max-w-xs mx-auto leading-relaxed">
              {isRegisterMode
                ? 'Create and register administrator credentials in Firebase Authentication.'
                : 'Sign in with your Firebase administrator credentials to access the store management console.'}
            </p>
          </div>

          {/* Mode Switcher (Sign In vs Register Admin) */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] border border-[#EAE4DC] rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                !isRegisterMode
                  ? 'bg-white text-[#1C1917] shadow-xs border border-[#EAE4DC]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                isRegisterMode
                  ? 'bg-white text-[#1C1917] shadow-xs border border-[#EAE4DC]'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Admin</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Administrator Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <Input
                  type="email"
                  required
                  placeholder="admin@crystellestudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Password</Label>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-11 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#57534E]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#EAE4DC] accent-[#C59A44]"
                />
                <span>Remember session</span>
              </label>

              <span className="text-[#A8A29E] text-[11px] font-mono">Firebase Auth</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading || loginSuccess}
              className="w-full h-11 bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs tracking-wide transition-all shadow-sm rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Authenticating with Firebase...</span>
              ) : loginSuccess ? (
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Authenticated
                </span>
              ) : isRegisterMode ? (
                <>
                  <span>Create Admin Account in Firebase</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Sign In to Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-[#F0ECE6] flex items-center justify-center gap-1.5 text-[11px] text-[#A8A29E]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secured via Google Firebase Authentication</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 py-5 text-center text-xs text-[#A8A29E]">
        <p>© 2026 Crystelle Studio • Store Management</p>
      </footer>
    </div>
  );
}
