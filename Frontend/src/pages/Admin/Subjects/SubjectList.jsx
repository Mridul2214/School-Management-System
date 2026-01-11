import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, BookOpen, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

const SubjectList = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/subjects');
            setSubjects(data);
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will delete the subject.")) {
            try {
                await api.delete(`/subjects/${id}`);
                fetchSubjects();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    const filteredSubjects = subjects.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Subjects</h1>
                    <p className="page-subtitle">Manage curriculum subjects</p>
                </div>
                <Link to="/admin/subjects/add" className="btn-primary flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                </Link>
            </div>

            <div className="search-bar-container">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="card-grid">
                    {filteredSubjects.map((sub) => (
                        <motion.div
                            key={sub._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="item-card flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="item-card-header">
                                    <div className="badge-code bg-purple-50 text-purple-600">
                                        {sub.code}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/admin/subjects/edit/${sub._id}`)}
                                            className="action-btn"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub._id)}
                                            className="action-btn-danger"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{sub.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {sub.course?.name} • Sem {sub.semester}
                                </p>

                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Credits</span>
                                        <span className="font-medium text-gray-900">{sub.credits}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Type</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${sub.type === 'Practical' ? 'bg-orange-100 text-orange-700' :
                                            sub.type === 'Project' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {sub.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Faculty</span>
                                        <div className="flex items-center text-gray-900">
                                            <User className="h-3 w-3 mr-1" />
                                            <span>{sub.faculty ? `${sub.faculty.firstName} ${sub.faculty.lastName}` : 'Unassigned'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubjectList;
