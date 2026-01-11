import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Lock, Phone, ArrowRight,
    Briefcase, Building2, BookOpen, Loader2, ArrowLeft,
    GraduationCap, CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Dropdown Data
    const [departments, setDepartments] = useState([]);
    // courses removed (cleaned up)

    const [formData, setFormData] = useState({
        role: 'Student',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userId: '',
        department: '',
        // course: '', removed
        semester: '1',
        designation: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes] = await Promise.all([
                    api.get('/departments')
                ]);
                setDepartments(deptRes.data);
            } catch (error) {
                console.error("Failed to load dependency data");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
                setError('Please fill in all personal details');
                return;
            }
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. User ID or Email might already exist.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md w-full"
                >
                    <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Success!</h2>
                    <p className="text-gray-500 font-medium">Your account has been created successfully. Redirecting you to login...</p>
                    <div className="mt-8 flex justify-center">
                        <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row shadow-inner">
            {/* Left Side: Branding/Info - HIDDEN ON MOBILE */}
            <div className="hidden lg:flex lg:w-1/3 bg-primary-600 p-8 lg:p-12 text-white flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors mb-12">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-bold tracking-tight">Back to Home</span>
                    </Link>
                    <GraduationCap className="h-16 w-16 mb-6 text-white/20" />
                    <h1 className="text-4xl lg:text-5xl font-black leading-tight">Join Our <br />Academic Community.</h1>
                    <p className="mt-6 text-primary-100 text-lg leading-relaxed opacity-80">
                        Create your account to access course materials, track attendance, and manage your academic profile seamlessly.
                    </p>
                </div>

                <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <p className="text-sm font-medium italic opacity-90">"The beautiful thing about learning is that no one can take it away from you."</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest opacity-60">— B.B. King</p>
                </div>

                {/* Decor elements */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="max-w-xl w-full">
                    <div className="mb-10">
                        <div className="flex items-center space-x-2 text-primary-600 font-bold text-sm tracking-widest uppercase mb-2">
                            <span>Step {step} of 2</span>
                            <div className="h-1 w-12 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary-600"
                                    animate={{ width: `${(step / 2) * 100}%` }}
                                />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2 font-medium">Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign In</Link></p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-medium rounded-r-xl"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="step1"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Role Toggle */}
                                    <div className="flex p-1 bg-slate-100 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'Student' })}
                                            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${formData.role === 'Student' ? 'bg-white shadow-lg text-primary-600 font-bold' : 'text-slate-500 font-medium'}`}
                                        >
                                            <GraduationCap className="h-4 w-4" />
                                            <span>Student</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: 'Staff' })}
                                            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${formData.role === 'Staff' ? 'bg-white shadow-lg text-primary-600 font-bold' : 'text-slate-500 font-medium'}`}
                                        >
                                            <Briefcase className="h-4 w-4" />
                                            <span>Staff</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                                                    placeholder="John"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Choose Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-center group hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        <span>Next: Profile Setup</span>
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">
                                            {formData.role === 'Student' ? 'Student Registration No' : 'Employee ID'}
                                        </label>
                                        <input
                                            type="text"
                                            name="userId"
                                            required
                                            value={formData.userId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all border-l-4 border-l-primary-500 placeholder:text-slate-400"
                                            placeholder={formData.role === 'Student' ? "STU101" : "EMP202"}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Department</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <select
                                                name="department"
                                                required
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all appearance-none"
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map(dept => (
                                                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {formData.role === 'Student' ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {/* Course selection removed as per requirement */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Semester</label>
                                                <input
                                                    type="number"
                                                    name="semester"
                                                    required
                                                    min="1"
                                                    value={formData.semester}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Designation</label>
                                            <input
                                                type="text"
                                                name="designation"
                                                required
                                                value={formData.designation}
                                                onChange={handleChange}
                                                className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
                                                placeholder="e.g. Professor"
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] py-5 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-200 flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : <CheckCircle2 className="h-5 w-5 mr-3" />}
                                            {loading ? 'Creating Account...' : 'Finish Registration'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
