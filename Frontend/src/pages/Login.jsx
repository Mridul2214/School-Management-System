import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowLeft, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const userData = await login(email, password);
            if (userData.role === 'Administrator') navigate('/admin/dashboard');
            else if (userData.role === 'Staff') navigate('/staff/dashboard');
            else navigate('/student/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row shadow-inner overflow-hidden">
            {/* Left Side: Professional Branding - HIDDEN ON MOBILE */}
            <div className="hidden lg:flex lg:w-2/5 bg-primary-600 p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors mb-12 group">
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold tracking-tight">Return to Portal</span>
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-8">
                            <GraduationCap className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                            Welcome Back to <br />
                            <span className="text-primary-200">The Smart Portal.</span>
                        </h1>
                        <p className="mt-6 text-primary-100 text-lg leading-relaxed opacity-80 max-w-md font-medium">
                            Access your personalized dashboard, track your academic progress, and stay connected with your department.
                        </p>
                    </motion.div>
                </div>

                <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="h-8 w-8 bg-green-400/20 rounded-full flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-green-300" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-primary-50">Secure Access Verified</span>
                    </div>
                    <p className="text-sm font-medium italic opacity-90 leading-relaxed">
                        "Education is the most powerful weapon which you can use to change the world."
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest opacity-60">— Nelson Mandela</p>
                </div>

                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -right-20 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"></div>
            </div>

            {/* Right Side: Login Form - FULL WIDTH ON MOBILE */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white lg:bg-[#f8fafc]/50 min-h-screen lg:min-h-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full"
                >
                    {/* Return link for mobile only */}
                    <div className="lg:hidden mb-10 text-left">
                        <Link to="/" className="inline-flex items-center space-x-2 text-primary-600 font-bold bg-primary-50 px-4 py-2 rounded-xl">
                            <ArrowLeft className="h-4 w-4" />
                            <span>Home</span>
                        </Link>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center space-x-2 text-primary-600 font-bold text-sm tracking-widest uppercase mb-3">
                            <span className="w-8 h-px bg-primary-200"></span>
                            <span>Secure Login</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h2>
                        <p className="text-slate-500 mt-3 font-medium">
                            Don't have an account yet?
                            <Link to="/register" className="text-primary-600 hover:underline ml-2 font-bold decoration-2 underline-offset-4 font-black">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-8 p-5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-bold rounded-r-2xl shadow-sm flex items-center"
                            >
                                <div className="h-5 w-5 bg-rose-200 text-rose-600 rounded-full flex items-center justify-center mr-3 shrink-0 text-[10px]">!</div>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Email or User ID</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-600 text-slate-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all shadow-sm placeholder:text-slate-300 font-medium"
                                    placeholder="Enter your email or ID"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Password</label>
                                <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700 font-black">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary-600 text-slate-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-8 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all shadow-sm placeholder:text-slate-300 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-1">
                            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer">Remember me for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl shadow-slate-200 flex items-center justify-center group hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-80 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Official Institute Management Platform</p>
                        <div className="flex justify-center space-x-6">
                            <div className="h-10 w-10 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer bg-slate-100 rounded-full flex items-center justify-center">🏫</div>
                            <div className="h-10 w-10 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer bg-slate-100 rounded-full flex items-center justify-center">🏛️</div>
                            <div className="h-10 w-10 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer bg-slate-100 rounded-full flex items-center justify-center">🛡️</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
