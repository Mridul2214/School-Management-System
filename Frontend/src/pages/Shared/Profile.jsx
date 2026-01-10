
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Camera, Check, AlertCircle, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: user?.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone
            };

            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const { data } = await api.put('/users/profile', updateData);

            // Success! Update local storage but auth context will handle on next refresh or we can manually update if needed.
            // For now, let's just show success.
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit Profile</h1>
                <p className="text-gray-500 font-medium mt-1">Manage your personal information and security settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Quick Profile Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary-600"></div>

                        <div className="relative inline-block mt-4">
                            <div className="h-32 w-32 rounded-3xl bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-primary-600 overflow-hidden group/avatar">
                                {user?.name?.[0] || 'U'}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Camera className="text-white h-8 w-8" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 mt-6 leading-tight">{user?.name}</h2>
                        <span className="inline-block bg-primary-50 text-primary-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">
                            {user?.role}
                        </span>

                        <div className="mt-8 space-y-4 text-left">
                            <div className="flex items-center text-gray-500 text-sm gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <User className="h-4 w-4 text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-gray-400">User ID</p>
                                    <p className="font-bold text-gray-700">{user?.userId}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100/50">
                                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <Mail className="h-4 w-4 text-primary-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] uppercase font-black text-gray-400">Primary Email</p>
                                    <p className="font-bold text-gray-700 truncate">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                        <div className="p-8 space-y-10">

                            {/* Personal Details */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-100">
                                        <User className="text-white h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">Personal Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-gray-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-gray-700"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-gray-700"
                                        />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-50" />

                            {/* Security Details */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg shadow-gray-200">
                                        <Lock className="text-white h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">Security & Password</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50 flex items-start gap-4">
                                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                        <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                            If you were registered by an administrator, we recommend changing your generated password immediately to secure your account.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Leave blank to keep current"
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-gray-700"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Status Messages and Save Button */}
                        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex-1 mr-4">
                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-red-600 flex items-center">
                                        <AlertCircle className="h-3 w-3 mr-2" /> {error}
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-green-600 flex items-center">
                                        <Check className="h-3 w-3 mr-2" /> Profile updated successfully!
                                    </motion.div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-primary-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center whitespace-nowrap"
                            >
                                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
