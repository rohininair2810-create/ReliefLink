import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

type Tab = 'login' | 'register';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const VictimAuth: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await auth.login(loginForm.email, loginForm.password, 'victim');
      navigate('/victim/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { fullName, phone, email, password, confirmPassword } = registerForm;
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await auth.register({ name: fullName, phone, email, password }, 'victim');
      navigate('/victim/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setLoginForm({ email: 'priya.sharma@demo.com', password: 'demo123' });
    setTab('login');
    setError(null);
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-10 text-white"
        style={{ backgroundColor: '#D94B45' }}
      >
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back to ReliefLink
          </Link>
        </div>

        <div className="flex flex-col items-start gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <AlertTriangle size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-['Manrope',sans-serif] mb-3">Victim Portal</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Report emergencies and get help. Connect with relief teams and volunteers in your area instantly.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {[
              'Report your emergency location',
              'Request specific types of aid',
              'Track relief team response',
              'Connect with nearby volunteers',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-2 h-2 rounded-full bg-white/60 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-xs">ReliefLink © 2024 · Emergency Coordination Platform</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12" style={{ backgroundColor: '#F4F6F8' }}>
        {/* Mobile back link */}
        <div className="lg:hidden w-full max-w-md mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm transition-colors"
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
            style={{ backgroundColor: '#FFF8E6', borderColor: '#E5A04B' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#E5A04B' }}>
              🔑 Demo Credentials
            </p>
            <p className="text-xs" style={{ color: '#718096' }}>
              Email: <span className="font-mono font-semibold text-gray-700">priya.sharma@demo.com</span>
            </p>
            <p className="text-xs" style={{ color: '#718096' }}>
              Password: <span className="font-mono font-semibold text-gray-700">demo123</span>
            </p>
            <button
              onClick={fillDemo}
              className="mt-2 text-xs font-semibold underline"
              style={{ color: '#E5A04B' }}
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
                    color: tab === t ? '#D94B45' : '#718096',
                    borderBottom: tab === t ? '2px solid #D94B45' : '2px solid transparent',
                    backgroundColor: 'transparent',
                  }}
                >
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold font-['Manrope',sans-serif] mb-1" style={{ color: '#172D40' }}>
                {tab === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-sm mb-6" style={{ color: '#718096' }}>
                {tab === 'login' ? 'Sign in to access your victim portal' : 'Register to report emergencies and get help'}
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
                        className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = '#D94B45')}
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
                        className="w-full pl-9 pr-10 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = '#D94B45')}
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
                    style={{ backgroundColor: '#D94B45', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="text"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        placeholder="Priya Sharma"
                        className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = '#D94B45')}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = '#D94B45')}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = '#D94B45')}
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
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="Min. 6 characters"
                        className="w-full pl-9 pr-10 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = '#D94B45')}
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

                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-10 py-3 rounded-lg border text-sm outline-none transition-all"
                        style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                        onFocus={(e) => (e.target.style.borderColor = '#D94B45')}
                        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#718096' }}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity mt-2"
                    style={{ backgroundColor: '#D94B45', opacity: loading ? 0.7 : 1 }}
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
              style={{ color: '#D94B45' }}
            >
              {tab === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VictimAuth;
