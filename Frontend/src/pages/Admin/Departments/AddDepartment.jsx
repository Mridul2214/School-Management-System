import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const AddDepartment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/departments', formData);
            navigate('/admin/departments');
        } catch (error) {
            console.error(error);
            alert("Failed to create department. Code might be duplicate."); // Better error handling needed
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Add Department</h1>
                    <p className="text-gray-500 text-sm mt-1">Create a new academic department</p>
                </div>
                <button
                    onClick={() => navigate('/admin/departments')}
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
                            <label className="form-label">Department Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science Engineering"
                                className="input-field"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Department Code</label>
                            <input
                                type="text"
                                name="code"
                                required
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g. CSE"
                                className="input-field uppercase"
                            />
                            <p className="text-xs text-gray-400 mt-1">Unique identifier code</p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the department's focus..."
                            className="input-field"
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/departments')}
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
                            Create Department
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepartment;
