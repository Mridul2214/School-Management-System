import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const AddSubject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Dropdown Data
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [staff, setStaff] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: '',
        course: '',
        semester: '',
        credits: '',
        type: 'Theory',
        faculty: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptRes, courseRes, userRes] = await Promise.all([
                    api.get('/departments'),
                    api.get('/courses'),
                    api.get('/users?role=Staff') // Assuming backend supports filtering or we filter manually
                ]);
                setDepartments(deptRes.data);
                setCourses(courseRes.data);
                // Filter users manually just in case api doesn't support query param yet
                const staffMembers = userRes.data.filter(u => u.role === 'Staff');
                setStaff(staffMembers);
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
            await api.post('/subjects', formData);
            navigate('/admin/subjects');
        } catch (error) {
            console.error(error);
            alert("Failed to create subject. Code might be unique.");
        } finally {
            setLoading(false);
        }
    };

    // Filter courses based on selected department if any
    const filteredCourses = formData.department
        ? courses.filter(c => c.department && c.department._id === formData.department)
        : courses;

    return (
        <div className="form-container">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add Subject</h1>
                    <p className="text-gray-500 text-sm mt-1">Add a new subject to a course curriculum</p>
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
                                placeholder="e.g. Data Structures"
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
                                placeholder="e.g. CS101"
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

                        <div className="form-group">
                            <label className="form-label">Course</label>
                            <select
                                name="course"
                                required
                                value={formData.course}
                                onChange={handleChange}
                                className="input-field"
                                disabled={!formData.department}
                            >
                                <option value="">Select Course</option>
                                {filteredCourses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.name} ({course.code})
                                    </option>
                                ))}
                            </select>
                            {!formData.department && <p className="text-xs text-gray-400 mt-1">Select a department first</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Semester</label>
                            <input
                                type="number"
                                name="semester"
                                required
                                value={formData.semester}
                                onChange={handleChange}
                                placeholder="1"
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
                                placeholder="3"
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
                            Create Subject
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubject;
