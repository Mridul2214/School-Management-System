
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Lock, Mail, Building2, BookOpen, AlertCircle, Save, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../../api/axios';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);

    // Dropdown Data
    const [departments, setDepartments] = useState([]);
    // courses removed

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userId: '',
        role: '',
        department: '',
        designation: '',
        // course: '', removed
        semester: 1,
        isActive: true,
        isHod: false,
        password: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, userRes] = await Promise.all([
                    api.get('/departments'),
                    api.get(`/users/${id}`)
                ]);

                setDepartments(deptRes.data);

                const userData = userRes.data;
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    userId: userData.userId || '',
                    role: userData.role || '',
                    department: userData.department?._id || userData.department || '',
                    designation: userData.designation || '',
                    // course: userData.course?._id || userData.course || '', removed
                    semester: userData.semester || 1,
                    isActive: userData.isActive !== undefined ? userData.isActive : true,
                    isHod: userData.designation?.toLowerCase().includes('hod') || false,
                    password: ''
                });
            } catch (error) {
                console.error("Failed to load user data");
                alert("Could not load user details");
                navigate('/admin/users');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            await api.put(`/users/${id}`, formData);
            alert("User updated successfully!");
            navigate('/admin/users');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to update user.");
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching User Records...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Edit {formData.role}</h1>
                    <p className="text-gray-500 font-medium mt-1">Update profile and system access for {formData.firstName}</p>
                </div>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center text-gray-500 hover:text-blue-600 font-bold uppercase tracking-widest text-xs transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Staff Management
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Status & Role Info Header */}
                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                                {formData.role[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">System Role</p>
                                <p className="text-lg font-black text-gray-900 leading-none">{formData.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-500">Account Status</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-bold text-xs ${formData.isActive
                                    ? 'border-green-100 bg-green-50 text-green-700'
                                    : 'border-red-100 bg-red-50 text-red-700'
                                    }`}
                            >
                                {formData.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                {formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">System ID</label>
                            <input
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-700 border-l-4 border-l-blue-600"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-50" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>

                        {formData.role === 'Student' ? (
                            <>
                                { /* Course dropdown removed */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Semester</label>
                                    <input
                                        type="number"
                                        name="semester"
                                        min="1"
                                        max="8"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-gray-700"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-gray-700"
                                    />
                                </div>
                                <div className="flex items-center space-x-3 ml-1">
                                    <input
                                        type="checkbox"
                                        id="isHod"
                                        name="isHod"
                                        checked={formData.isHod}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all"
                                    />
                                    <label htmlFor="isHod" className="text-sm font-bold text-gray-600">
                                        Designate as Head of Department (HOD)
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50 flex items-start gap-4">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                            <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Administrative Security</p>
                            <p className="text-xs font-bold text-amber-800/80 leading-relaxed">
                                Updating passwords here will force-reset the user's credential. Use this only if the user has lost access to their account.
                            </p>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter new password to reset"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-3 w-full px-4 py-3 bg-white border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="px-8 py-4 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 rounded-2xl transition-all"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            disabled={saveLoading}
                            className="px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center"
                        >
                            {saveLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Update User Records
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditUser;
