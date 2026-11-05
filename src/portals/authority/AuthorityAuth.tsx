import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft, Mail, Lock, Info } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

const AuthorityAuth: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });

  const navy = '#172D40';
  const secondaryNavy = '#24465C';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await auth.login(loginForm.email, loginForm.password, 'authority');
      navigate('/authority/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setLoginForm({ email: 'collector@district.gov.in', password: 'admin123' });
    setError(null);
  };

  return (
    <div className="min-h-screen flex font-['Inter',sans-serif]">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex flex-col justify-between w-2/5 p-10 text-white"
        style={{ backgroundColor: navy }}
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
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <Shield size={40} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-['Manrope',sans-serif] mb-3">
              Authority Portal
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Coordinate district-wide disaster relief operations with real-time situational awareness and resource management.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            {[
              'Oversee all active relief operations',
              'Allocate resources across zones',
              'Manage volunteer deployments',
              'Generate official incident reports',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-2 h-2 rounded-full bg-white/50 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Security badge */}
          <div
            className="w-full p-4 rounded-xl flex items-start gap-3"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <Shield size={18} className="text-white/70 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white/90 mb-0.5">Restricted Access</p>
              <p className="text-xs text-white/60">
                This portal is restricted to authorised government personnel only. Unauthorised access attempts are logged and reported.
              </p>
            </div>
          </div>
        </div>

        <p className="text-white/40 text-xs">ReliefLink © 2024 · Emergency Coordination Platform</p>
      </div>

      {/* RIGHT PANEL */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12"
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
            style={{ backgroundColor: '#FFF8E6', borderColor: '#E5A04B' }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: '#E5A04B' }}>
              🔑 Demo Credentials
            </p>
            <p className="text-xs" style={{ color: '#718096' }}>
              Official Email: <span className="font-mono font-semibold text-gray-700">collector@district.gov.in</span>
            </p>
            <p className="text-xs" style={{ color: '#718096' }}>
              Password: <span className="font-mono font-semibold text-gray-700">admin123</span>
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
            {/* Header bar */}
            <div className="px-8 py-5 border-b" style={{ borderColor: '#E2E8F0', backgroundColor: navy }}>
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-white" />
                <span className="text-white font-semibold font-['Manrope',sans-serif]">Authority Sign In</span>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold font-['Manrope',sans-serif] mb-1" style={{ color: '#172D40' }}>
                Official Login
              </h2>
              <p className="text-sm mb-4" style={{ color: '#718096' }}>
                Sign in with your government-issued credentials
              </p>

              {/* No self-registration notice */}
              <div
                className="mb-5 p-3 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: '#EBF4FF', border: '1px solid #93C5FD' }}
              >
                <Info size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
                <p className="text-xs" style={{ color: '#1E40AF' }}>
                  <span className="font-semibold">Authority accounts require admin provisioning.</span>
                  {' '}Self-registration is not available. Please contact your district IT administrator to get access.
                </p>
              </div>

              {error && (
                <div
                  className="mb-4 p-3 rounded-lg text-sm"
                  style={{ backgroundColor: '#FEF2F2', color: '#D94B45', border: '1px solid #FCA5A5' }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#172D40' }}>
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#718096' }} />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="officer@district.gov.in"
                      className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm outline-none transition-all"
                      style={{ borderColor: '#E2E8F0', color: '#172D40' }}
                      onFocus={(e) => (e.target.style.borderColor = navy)}
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
                      onFocus={(e) => (e.target.style.borderColor = navy)}
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
                  style={{ backgroundColor: navy, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Authenticating…' : 'Sign In Securely'}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: '#718096' }}>
            Need access?{' '}
            <a
              href="mailto:admin@relieflink.gov.in"
              className="font-semibold underline"
              style={{ color: '#172D40' }}
            >
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorityAuth;
