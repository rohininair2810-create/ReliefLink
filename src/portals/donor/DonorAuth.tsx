import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Building2 } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

type Tab = 'login' | 'register';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  password: string;
}

const DonorAuth: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    password: '',
  });

  const amber = '#E5A04B';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await auth.login(loginForm.email, loginForm.password, 'donor');
      navigate('/donor/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { name, email, phone, password } = registerForm;
    if (!name || !email || !phone || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await auth.register({ ...registerForm }, 'donor');
      navigate('/donor/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setLoginForm({ email: 'helpinghand@example.com', password: 'demo123' });
    setTab('login');
    setError(null);
  };

  const inputBase = 'w-full py-3 rounded-lg border text-sm outline-none transition-all';

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-10 text-white"
        style={{ backgroundColor: amber }}
      >
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to ReliefLink
          </Link>
        </div>

        <div className="flex flex-col items-start gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            <Heart size={40} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-['Manrope',sans-serif] mb-3">
              Donor Portal
            </h1>
            <p className="text-white/90 text-lg leading-relaxed">
              Your generosity saves lives. Contribute funds, supplies, and resources to disaster-affected communities.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {[
              'Donate funds to verified relief funds',
              'Contribute supplies and essentials',
              'Track your donation impact',
              'Get tax exemption certificates',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-2 h-2 rounded-full bg-white/70 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Impact stats */}
          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            {[
              { value: '₹2.4Cr+', label: 'Funds raised' },
              { value: '12,000+', label: 'Lives impacted' },
              { value: '340+', label: 'Donors active' },
              { value: '98%', label: 'Fund utilisation' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
              >
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/60 text-xs">ReliefLink © 2024 · Emergency Coordination Platform</p>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto"
        style={{ backgroundColor: '#F4F6F8' }}
      >
        {/* Mobile back link */}
        <div className="lg:hidden w-full max-w-md mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm"
            style={{ color: '#718096' }}
          >
            <ArrowLeft size={16} />
            Back to ReliefLink
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Demo credentials */}
          <div
            className="mb-6 p-4 rounded-xl border"
            style={{ backgroundColor: '#FFF8E6', borderColor: amber }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: amber }}>
              🔑 Demo Credentials
            </p>
            <p className="text-xs" style={{ color: '#718096' }}>
              Email: <span className="font-mono font-semibold text-gray-700">helpinghand@example.com</span>
            </p>
            <p className="text-xs" style={{ color: '#718096' }}>
              Password: <span className="font-mono font-semibold text-gray-700">demo123</span>
            </p>
            <button
              onClick={fillDemo}
              className="mt-2 text-xs font-semibold underline"
              style={{ color: amber }}
            >
              Auto-fill credentials →
            </button>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: '#E2E8F0' }}>
              {(['login', 'register'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(null); }}
                  className="flex-1 py-4 text-sm font-semibold capitalize transition-colors"
                  style={{
                    color: tab === t ? amber : '#718096',
                    borderBottom: tab === t ? `2px solid ${amber}` : '2px solid transparent',
                    backgroundColor: 'transparent',
                  }}
                >
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold font-['Manrope',sans-serif] mb-1" style={{ color: '#172D40' }}>
                {tab === 'login' ? 'Welcome back' : 'Become a Donor'}
              </h2>
              <p className="text-sm mb-6" style={{ color: '#718096' }}>
                {tab === 'login'
                  ? 'Sign in to manage your donations and impact'
                  : 'Join thousands making a difference in disaster relief'}
              </p>

              {error && (
                <div
                  className="mb-4 p-3 rounded-lg text-sm"
                  style={{ backgroundColor: '#FEF2F2', color: '#D94B45', border: '1px solid #FCA5A5' }}
                >
                  {error}
                </div>
              )}

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className={`${inputBase} pl-9 pr-4`}
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = amber)}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="••••••••"
                        className={`${inputBase} pl-9 pr-10`}
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = amber)}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#718096' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity mt-2"
                    style={{ backgroundColor: amber, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Full Name <span style={{ color: '#D94B45' }}>*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="text"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        placeholder="Your full name"
                        className={`${inputBase} pl-9 pr-4`}
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = amber)}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Email Address <span style={{ color: '#D94B45' }}>*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className={`${inputBase} pl-9 pr-4`}
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = amber)}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Phone Number <span style={{ color: '#D94B45' }}>*</span>
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className={`${inputBase} pl-9 pr-4`}
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = amber)}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                    </div>
                  </div>

                  {/* Organisation (optional) */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Organisation{' '}
                      <span className="font-normal" style={{ color: '#718096' }}>(optional)</span>
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="text"
                        value={registerForm.organisation}
                        onChange={(e) => setRegisterForm({ ...registerForm, organisation: e.target.value })}
                        placeholder="Company / NGO / Trust"
                        className={`${inputBase} pl-9 pr-4`}
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = amber)}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Password <span style={{ color: '#D94B45' }}>*</span>
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="Min. 6 characters"
                        className={`${inputBase} pl-9 pr-10`}
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = amber)}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#718096' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity mt-2"
                    style={{ backgroundColor: amber, opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Creating account…' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#718096' }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(null); }}
              className="font-semibold underline"
              style={{ color: amber }}
            >
              {tab === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorAuth;
