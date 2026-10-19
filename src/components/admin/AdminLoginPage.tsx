import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ADMIN_CREDENTIALS,
  validateAdminCredentials,
  createAdminSession,
  saveStoredAdminSession,
  AdminSession,
} from '@/lib/admin-auth';

interface AdminLoginPageProps {
  onLoginSuccess: (session: AdminSession) => void;
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (validateAdminCredentials(email, password)) {
        const session = createAdminSession(email);
        if (rememberMe) {
          saveStoredAdminSession(session);
        }
        setLoginSuccess(true);
        setTimeout(() => {
          onLoginSuccess(session);
        }, 500);
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Please verify your administrator email and password.');
      }
    }, 450);
  };

  const handleQuickFill = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C1917] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#C59A44]/20 selection:text-[#9A7228]">
      {/* Background Lighting & Ambiance (Light Theme) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#C59A44]/10 rounded-full blur-[140px] pointer-events-none"></div>

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
              Admin Portal Login
            </h1>
            <p className="text-xs text-[#78716C] max-w-xs mx-auto leading-relaxed">
              Sign in with your administrator credentials to manage orders, products, customers, and promocodes.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Fill Pill */}
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE4DC] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A67C2E]" />
              <div className="text-[11px]">
                <span className="text-[#1C1917] font-semibold block">Admin Credentials</span>
                <span className="text-[#78716C] font-mono">admin@gmail.com • admin123</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-semibold text-[#A67C2E] hover:text-[#8C6420] bg-white px-2.5 py-1 rounded-lg border border-[#EAE4DC] shadow-2xs hover:bg-[#F5EFE6] transition-colors"
            >
              Autofill
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#44403C]">Email Address</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <Input
                  type="email"
                  required
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 h-11 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-[#44403C]">Password</Label>
                <span className="text-[10px] text-[#A8A29E] font-mono">admin123</span>
              </div>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 h-11 bg-[#FAF8F5] border-[#EAE4DC] text-xs text-[#1C1917] focus-visible:ring-[#C59A44]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917]"
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

              <span className="text-[#A8A29E] text-[11px] font-mono">Protected</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading || loginSuccess}
              className="w-full h-11 bg-[#C59A44] hover:bg-[#B58934] text-white font-semibold text-xs tracking-wide transition-all shadow-sm rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : loginSuccess ? (
                <span className="flex items-center gap-1.5 text-white font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Access Granted
                </span>
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
            <span>Encrypted Administrator Session</span>
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
