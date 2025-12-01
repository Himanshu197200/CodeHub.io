import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';

const OrganizerLogin = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { sendOtp, login, logout } = useAuth();


    useEffect(() => {
        logout();
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await sendOtp(email);
            setStep(2);
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, otp);
            navigate('/create-event');
        } catch (err) {
            setError('Invalid OTP or expired.');
        } finally {
            setLoading(false);
        }
    };

    const GoogleIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">

            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">

                        <div className="px-8 pt-8 pb-6 text-center">
                            <img src="/nst-logo.png" alt="NST Events" className="w-16 h-16 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {step === 1 ? 'Host an Event' : 'Verify Code'}
                            </h2>
                            <p className="text-gray-500">
                                {step === 1
                                    ? 'Organizer login for NST Events'
                                    : `Enter the code sent to ${email}`
                                }
                            </p>
                        </div>

                        <div className="px-8 pb-8">
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                                    <p className="text-sm text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="block text-sm font-bold text-gray-900">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                            placeholder="organizer@college.edu"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Continue'}
                                    </button>

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-200"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
                                        </div>
                                    </div>

                                    <a
                                        href="http://localhost:5001/api/auth/google?role=ORGANIZER"
                                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <GoogleIcon />
                                        <span>Google</span>
                                    </a>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="otp" className="block text-sm font-bold text-gray-900">
                                            Verification Code
                                        </label>
                                        <input
                                            id="otp"
                                            type="text"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                            placeholder="• • • • • •"
                                            maxLength={6}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Verify & Login'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full text-sm text-gray-500 hover:text-gray-900 underline decoration-1 underline-offset-2 transition-colors"
                                    >
                                        Edit email address
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                By continuing, you agree to NST Events's <a href="#" className="underline hover:text-gray-800">Terms</a> and <a href="#" className="underline hover:text-gray-800">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerLogin;
