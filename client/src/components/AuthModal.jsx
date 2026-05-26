import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose }) {
    const { login } = useAuth();
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot', 'otp', 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const API_URL = 'http://localhost:4000/api/auth';

    const handleAction = async (endpoint, payload) => {
        setIsLoading(true);
        setError('');
        setMsg('');
        try {
            const res = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (view === 'signup') {
            const data = await handleAction('signup', { email, password, name });
            if (data) {
                setMsg(data.message);
                setView('otp');
            }
        } else if (view === 'login') {
            const data = await handleAction('login', { email, password });
            if (data) {
                login(data.user, data.token);
                if (onClose) onClose();
            }
        } else if (view === 'forgot') {
            const data = await handleAction('forgot-password', { email });
            if (data) {
                setMsg(data.message);
                setView('reset');
            }
        } else if (view === 'otp') {
            const data = await handleAction('verify-otp', { email, otp, type: 'verification' });
            if (data) {
                login(data.user, data.token);
                if (onClose) onClose();
            }
        } else if (view === 'reset') {
            const data = await handleAction('reset-password', { email, otp, newPassword: password });
            if (data) {
                setMsg(data.message);
                setView('login');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/40 backdrop-blur-md">
            <div className="w-full max-w-[400px] bg-white rounded-[24px] border border-[#E8E8E8] shadow-card p-6 md:p-8 relative overflow-hidden">

                {/* Soft background glow for the modal */}
                <div className="absolute w-[300px] h-[300px] -top-[100px] -right-[100px] bg-[#17CA8C] opacity-10 rounded-full blur-[60px] pointer-events-none" />

                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="font-sf font-semibold text-[22px] bg-clip-text text-transparent bg-gradient-to-r from-[#555555] to-[#888888]">
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'otp' && 'Verify Email'}
                        {view === 'reset' && 'Set New Password'}
                    </h2>
                    {onClose && (
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 border border-gray-100 text-gray-400 hover:text-gray-600">
                            ×
                        </button>
                    )}
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-[13px] rounded-xl font-sf border border-red-100">{error}</div>}
                {msg && <div className="mb-4 p-3 bg-green-50 text-green-600 text-[13px] rounded-xl font-sf border border-green-100">{msg}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                    {(view === 'signup' || view === 'login' || view === 'forgot' || view === 'otp' || view === 'reset') && view !== 'otp' && view !== 'reset' && (
                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full h-[48px] px-4 rounded-[14px] border border-[#EEEEEE] bg-[#FAFAFA] font-sf text-[14px] outline-none focus:border-[#00C278] transition-colors"
                        />
                    )}

                    {view === 'signup' && (
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full h-[48px] px-4 rounded-[14px] border border-[#EEEEEE] bg-[#FAFAFA] font-sf text-[14px] outline-none focus:border-[#00C278] transition-colors"
                        />
                    )}

                    {(view === 'signup' || view === 'login' || view === 'reset') && (
                        <input
                            type="password"
                            placeholder={view === 'reset' ? 'New Password' : 'Password'}
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full h-[48px] px-4 rounded-[14px] border border-[#EEEEEE] bg-[#FAFAFA] font-sf text-[14px] outline-none focus:border-[#00C278] transition-colors"
                        />
                    )}

                    {(view === 'otp' || view === 'reset') && (
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            required
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full h-[48px] px-4 rounded-[14px] border border-[#EEEEEE] bg-[#FAFAFA] font-sf text-[14px] outline-none text-center tracking-[0.5em] focus:border-[#00C278] transition-colors"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-[48px] rounded-[14px] font-sf font-medium text-white shadow-sm transition-opacity mt-2 ${isLoading ? 'opacity-70' : 'hover:opacity-90'}`}
                        style={{ background: 'linear-gradient(180deg, #00E58D 0%, #00C278 100%)' }}
                    >
                        {isLoading ? 'Please wait...' : 'Continue'}
                    </button>

                    {view === 'login' && (
                        <div className="relative flex items-center justify-center my-1 mt-3">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <span className="relative px-3 bg-white text-xs text-gray-400 font-sf uppercase">Or</span>
                        </div>
                    )}

                    {view === 'login' && (
                        <button
                            type="button"
                            className="w-full h-[48px] rounded-[14px] font-sf text-[14px] font-medium text-gray-700 bg-white border border-[#E8E8E8] shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            onClick={() => alert("Google OAuth requires Client ID. Use credential login for now.")}
                        >
                            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    )}
                </form>

                <div className="mt-5 flex flex-col items-center gap-3 font-sf text-[13px] text-gray-500 relative z-10">
                    {view === 'login' && (
                        <>
                            <button onClick={() => setView('forgot')} className="hover:text-[#00C278]">Forgot password?</button>
                            <div className="flex gap-1 mt-1">
                                <span>New here?</span>
                                <button onClick={() => setView('signup')} className="text-[#00C278] font-medium">Create an account</button>
                            </div>
                        </>
                    )}
                    {view === 'signup' && (
                        <div className="flex gap-1">
                            <span>Already have an account?</span>
                            <button onClick={() => setView('login')} className="text-[#00C278] font-medium">Log in</button>
                        </div>
                    )}
                    {(view === 'forgot' || view === 'otp' || view === 'reset') && (
                        <button onClick={() => setView('login')} className="hover:text-[#00C278]">Back to login</button>
                    )}
                </div>

            </div>
        </div>
    );
}
