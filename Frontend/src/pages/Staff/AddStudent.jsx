
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Mail, Building2, BookOpen, Calendar, MapPin } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AddStudent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Dropdown Data
    // courses removed
    const [departments, setDepartments] = useState([]);

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
        admissionDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [deptRes] = await Promise.all([
                    api.get('/departments')
                ]);
                setDepartments(deptRes.data);

                // If staff member has a department, pre-select it
                if (user?.department) {
                    setFormData(prev => ({ ...prev, department: user.department._id || user.department }));
                }
            } catch (error) {
                console.error("Failed to load initial data");
            }
        };
        fetchInitialData();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            alert("Student registered successfully!");
            navigate('/staff/dashboard');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to register student.");
        } finally {
            setLoading(false);
        }
    };

    // filteredCourses removed

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Register New Student</h1>
                    <p className="text-gray-500 font-medium mt-1">Add a new student to the department database</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-primary-600 font-bold uppercase tracking-widest text-xs transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* section: Personal Info */}
                    <div>
                        <div className="flex items-center space-x-2 text-primary-600 font-black uppercase tracking-widest text-xs mb-6 px-2 border-l-4 border-primary-500">
                            <User className="h-4 w-4" />
                            <span>Personal Information</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                        placeholder="student@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Temporary Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {/* section: Academic Info */}
                    <div>
                        <div className="flex items-center space-x-2 text-primary-600 font-black uppercase tracking-widest text-xs mb-6 px-2 border-l-4 border-primary-500">
                            <Building2 className="h-4 w-4" />
                            <span>Academic Enrollment</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Registration Number</label>
                                <input
                                    type="text"
                                    name="userId"
                                    required
                                    value={formData.userId}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium border-l-4 border-l-primary-500"
                                    placeholder="e.g. STU-2024-001"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Department</label>
                                <select
                                    name="department"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium appearance-none"
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            { /* Course selection removed */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Semester</label>
                                    <input
                                        type="number"
                                        name="semester"
                                        required
                                        min="1"
                                        max="8"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Admission Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            name="admissionDate"
                                            value={formData.admissionDate}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 text-gray-500 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 bg-primary-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center"
                        >
                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Register Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
