import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const EditSubject = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Dropdown Data
    const [departments, setDepartments] = useState([]);
    // courses removed
    const [staff, setStaff] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: '',
        // course: '', removed
        semester: '',
        credits: '',
        type: 'Theory',
        faculty: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, userRes, subjectRes] = await Promise.all([
                    api.get('/departments'),
                    api.get('/users?role=Staff'),
                    api.get(`/subjects/${id}`)
                ]);
                setDepartments(deptRes.data);
                // setCourses removed

                const staffMembers = userRes.data.filter(u => u.role === 'Staff');
                setStaff(staffMembers);

                const subject = subjectRes.data;
                setFormData({
                    name: subject.name,
                    code: subject.code,
                    department: subject.department?._id || subject.department,
                    // course: subject.course?._id || subject.course, removed
                    semester: subject.semester,
                    credits: subject.credits,
                    type: subject.type,
                    faculty: subject.faculty?._id || subject.faculty || ''
                });
            } catch (error) {
                console.error("Failed to load data");
                alert("Could not load subject details");
                navigate('/admin/subjects');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/subjects/${id}`, formData);
            alert("Subject updated successfully!");
            navigate('/admin/subjects');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to update subject.");
        } finally {
            setLoading(false);
        }
    };

    // Filter courses based on selected department
    // filteredCourses removed

    if (initialLoading) return <div className="p-8 text-center text-gray-500">Loading Subject Details...</div>;

    return (
        <div className="form-container">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Subject</h1>
                    <p className="text-gray-500 text-sm mt-1">Update subject curriculum details</p>
                </div>
                <button
                    onClick={() => navigate('/admin/subjects')}
                    className="text-gray-500 hover:text-gray-700 font-medium flex items-center transition"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to List
                </button>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit} className="form-section">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label className="form-label">Subject Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject Code</label>
                            <input
                                type="text"
                                name="code"
                                required
                                value={formData.code}
                                onChange={handleChange}
                                className="input-field uppercase"
                            />
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

                        { /* Course selection removed */}

                        <div className="form-group">
                            <label className="form-label">Semester</label>
                            <input
                                type="number"
                                name="semester"
                                required
                                value={formData.semester}
                                onChange={handleChange}
                                min="1"
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Credits</label>
                            <input
                                type="number"
                                name="credits"
                                required
                                value={formData.credits}
                                onChange={handleChange}
                                min="0"
                                className="input-field"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="Theory">Theory</option>
                                <option value="Practical">Practical</option>
                                <option value="Project">Project</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assign Faculty</label>
                            <select
                                name="faculty"
                                required
                                value={formData.faculty}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">Select Faculty</option>
                                {staff.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.firstName} {s.lastName} ({s.department?.name || 'No Dept'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/subjects')}
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
                            Update Subject
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubject;
