import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useStore } from '@/components/storefront';
import { pageHead, hero, ambience } from '@/lib/store-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Heart,
  PackageCheck,
  LogIn,
  KeyRound,
} from 'lucide-react';

export const Route = createFileRoute('/login')({
  head: () =>
    pageHead(
      'Sign In / Create Account',
      'Sign in to your Crystelle Studio account to personalize fragrance preferences and manage candle orders.',
    ),
  component: LoginPage,
});

function LoginPage() {
  const { user, login, notify } = useStore();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect to profile immediately
  useEffect(() => {
    if (user) {
      navigate({ to: '/profile' });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (isRegister && !fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      login(cleanEmail, isRegister ? fullName : undefined);
      setLoading(false);
      navigate({ to: '/profile' });
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login('kartiki@crystellestudio.com', 'Kartiki Borgave');
      setLoading(false);
      navigate({ to: '/profile' });
    }, 350);
  };

  return (
    <main className="pro-auth-viewport">
      <div className="pro-auth-wrapper">
        <div className="pro-auth-card">
          {/* LEFT: Immersive Luxury Visual */}
          <div className="pro-visual-pane">
            <img
              src={ambience}
              alt="Warm handcrafted candle ambience"
              className="pro-visual-img"
            />
            <div className="pro-visual-overlay" />

            <div className="pro-visual-content">
              {/* Brand Top Pill */}
              <div className="pro-brand-crest">
                <img
                  src="/crystelle-gold-logo.png"
                  alt="Crystelle Studio"
                  className="pro-crest-logo"
                  width={46}
                  height={46}
                />
                <div className="pro-crest-text">
                  <strong>Crystelle</strong>
                  <span>Studio Atelier</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="pro-visual-hero">
                <span className="pro-eyebrow">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  Hand-poured in Small Batches
                </span>
                <h1 className="pro-visual-title">
                  Step into your <br />
                  <em>sanctuary of calm.</em>
                </h1>
                <p className="pro-visual-desc">
                  Curate your personalized aroma profile, unlock private seasonal drops, and experience
                  warmth designed for your everyday moments.
                </p>
              </div>

              {/* Atmospheric Testimonial Card */}
              <div className="pro-testimonial-card">
                <div className="pro-stars">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <p className="pro-quote">
                  &ldquo;The Lavender Bliss transformed my entire evening ritual. The burn is clean,
                  calming, and deeply luxurious.&rdquo;
                </p>
                <div className="pro-author">
                  <span className="pro-author-name">Kartiki B.</span>
                  <span className="pro-author-badge">Verified Collector</span>
                </div>
              </div>

              {/* Trust Badges Bar */}
              <div className="pro-trust-row">
                <div className="pro-trust-item">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>100% Pure Soy Wax</span>
                </div>
                <div className="pro-trust-item">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Secure Studio Session</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: High-End Sign In / Registration Form */}
          <div className="pro-form-pane">
            <div className="pro-form-inner">
              {/* Top Navigation / Mode Switcher */}
              <div className="pro-tabs-container">
                <div className="pro-tab-slider">
                  <button
                    type="button"
                    className={`pro-tab ${!isRegister ? 'active' : ''}`}
                    onClick={() => {
                      setIsRegister(false);
                      setErrorMessage('');
                    }}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`pro-tab ${isRegister ? 'active' : ''}`}
                    onClick={() => {
                      setIsRegister(true);
                      setErrorMessage('');
                    }}
                  >
                    <User className="w-3.5 h-3.5" />
                    Create Account
                  </button>
                </div>
              </div>

              {/* Header Title */}
              <div className="pro-heading-wrap">
                <span className="pro-subhead-badge">
                  {isRegister ? 'New Member Registration' : 'Studio Member Access'}
                </span>
                <h2 className="pro-form-h2">
                  {isRegister ? 'Join the Crystelle Circle' : 'Welcome Back'}
                </h2>
                <p className="pro-form-subtitle">
                  {isRegister
                    ? 'Create your account to configure your personal aroma palette.'
                    : 'Sign in to access your profile preferences and saved orders.'}
                </p>
              </div>

              {/* Instant 1-Click Demo Access Banner */}
              <div className="pro-demo-card">
                <div className="pro-demo-icon">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                </div>
                <div className="pro-demo-text">
                  <strong className="text-xs text-foreground block font-semibold">
                    1-Click Instant Demo Login
                  </strong>
                  <span className="text-[11px] text-muted-foreground block">
                    Pre-fills Kartiki&apos;s verified demo account and navigates straight to profile setup.
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="pro-demo-btn"
                  onClick={handleQuickDemoLogin}
                  disabled={loading}
                >
                  Quick Sign In
                </Button>
              </div>

              <div className="pro-divider">
                <span>or continue with email</span>
              </div>

              {/* Error Callout */}
              {errorMessage && (
                <div className="pro-error-alert" role="alert">
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Main Credentials Form */}
              <form onSubmit={handleSubmit} className="pro-auth-form">
                {isRegister && (
                  <div className="pro-field-group">
                    <Label htmlFor="fullname" className="pro-label">
                      Full Name
                    </Label>
                    <div className="pro-input-wrap">
                      <User className="pro-field-icon" />
                      <Input
                        id="fullname"
                        type="text"
                        placeholder="e.g. Kartiki Borgave"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={isRegister}
                        autoComplete="name"
                        className="pro-input"
                      />
                    </div>
                  </div>
                )}

                <div className="pro-field-group">
                  <Label htmlFor="email" className="pro-label">
                    Email Address
                  </Label>
                  <div className="pro-input-wrap">
                    <Mail className="pro-field-icon" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. kartiki@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="pro-input"
                    />
                  </div>
                </div>

                <div className="pro-field-group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="pro-label">
                      Password
                    </Label>
                    {!isRegister && (
                      <button
                        type="button"
                        className="pro-forgot-link"
                        onClick={() =>
                          notify('A password recovery email has been dispatched.')
                        }
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="pro-input-wrap">
                    <Lock className="pro-field-icon" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      className="pro-input pr-10"
                    />
                    <button
                      type="button"
                      className="pro-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pro-remember-bar">
                  <label className="pro-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="pro-check-input"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full pro-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="pro-spinner" /> Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isRegister ? 'Create Account & Continue' : 'Sign In to Profile Setup'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Bottom Return Link */}
              <div className="pro-card-footer">
                <Link to="/shop" className="pro-back-link">
                  ← Return to Candle Collection
                </Link>
                <span className="pro-guarantee">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline mr-1" />
                  SSL 256-bit Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
