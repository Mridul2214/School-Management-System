
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const AddCourse = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: '',
        duration: '',
        totalCredits: '',
        description: '',
    });

    useEffect(() => {
        const fetchDeps = async () => {
            try {
                const { data } = await api.get('/departments');
                setDepartments(data);
            } catch (error) {
                console.error("Failed to load departments");
            }
        };
        fetchDeps();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/courses', formData);
            navigate('/admin/courses');
        } catch (error) {
            console.error(error);
            alert("Failed to create course.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add Course</h1>
                    <p className="text-gray-500 text-sm mt-1">Define a new study program</p>
                </div>
                <button
                    onClick={() => navigate('/admin/courses')}
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
                            <label className="form-label">Course Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech Computer Science"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Course Code</label>
                            <input
                                type="text"
                                name="code"
                                required
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g. BTCS"
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
                                        {dept.name} ({dept.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Duration (Semesters)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    required
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="8"
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Total Credits</label>
                                <input
                                    type="number"
                                    name="totalCredits"
                                    required
                                    value={formData.totalCredits}
                                    onChange={handleChange}
                                    placeholder="160"
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Course details and outcomes..."
                            className="input-field"
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/courses')}
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
                            Create Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourse;
