
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Lock, Mail, Phone, MapPin, Building2, BookOpen } from 'lucide-react';
import api from '../../../api/axios';


const AddUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Dropdown Data
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        role: 'Staff', // Changed default
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userId: '',
        department: '',
        designation: '',
        isHod: false, // New field
        joiningDate: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, courseRes] = await Promise.all([
                    api.get('/departments'),
                    api.get('/courses')
                ]);
                setDepartments(deptRes.data);
                setCourses(courseRes.data);
            } catch (error) {
                console.error("Failed to load form data");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData); // Using auth register for creation
            navigate('/admin/users');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = formData.department
        ? courses.filter(c => c.department && c.department._id === formData.department)
        : courses;

    return (
        <div className="form-container">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add New Staff / admin</h1>
                    <p className="text-gray-500 text-sm mt-1">Create accounts for Staff members and Administrators</p>
                </div>
                <button
                    onClick={() => navigate('/admin/users')}
                    className="text-gray-500 hover:text-gray-700 font-medium flex items-center transition"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                </button>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit} className="form-section">

                    {/* Role Selection */}
                    <div className="mb-8">
                        <label className="form-label block mb-3">User Role</label>
                        <div className="flex space-x-4">
                            {['Staff', 'Administrator'].map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role, isHod: false })}
                                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${formData.role === role
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Common Fields */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                Personal Information
                            </h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Employee ID</label>
                            <input
                                type="text"
                                name="userId"
                                required
                                value={formData.userId}
                                onChange={handleChange}
                                placeholder="e.g. EMP101"
                                className="input-field"
                            />
                        </div>

                        {/* Role Specific Fields */}
                        {(formData.role === 'Staff' || formData.role === 'Administrator') && (
                            <>
                                <div className="md:col-span-2 mt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                                        Academic Details
                                    </h3>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Department</label>
                                    <select
                                        name="department"
                                        required
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {formData.role === 'Staff' && (
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="isHod"
                                    name="isHod"
                                    checked={formData.isHod}
                                    onChange={(e) => setFormData({ ...formData, isHod: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isHod" className="text-sm font-medium text-gray-700">
                                    Designate as Head of Department (HOD)
                                </label>
                            </div>
                        )}

                        {formData.role === 'Staff' && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        required
                                        value={formData.designation}
                                        onChange={handleChange}
                                        placeholder="e.g. Professor"
                                        className="input-field"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Joining Date</label>
                                    <input
                                        type="date"
                                        name="joiningDate"
                                        value={formData.joiningDate}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </>
                        )}

                    </div>

                    <div className="form-actions mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/users')}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex items-center"
                        >
                            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;
