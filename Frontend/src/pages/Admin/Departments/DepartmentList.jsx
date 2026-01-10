import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../../api/axios';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/departments');
            setDepartments(data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This action cannot be undone.")) {
            // To be implemented in backend completely, placeholder prompt for now
            alert("Delete feature coming soon in API");
        }
    }

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Departments</h1>
                    <p className="page-subtitle">Manage academic departments</p>
                </div>
                <Link to="/admin/departments/add" className="btn-primary flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="search-bar-container">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Departments Grid */}
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="card-grid">
                    {filteredDepartments.map((dept) => (
                        <motion.div
                            key={dept._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="item-card"
                        >
                            <div className="p-6">
                                <div className="item-card-header">
                                    <div className="badge-code">
                                        {dept.code}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="action-btn">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(dept._id)} className="action-btn-danger">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{dept.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                    {dept.description || "No description provided."}
                                </p>
                                <div className="flex items-center pt-4 border-t border-gray-50">
                                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold mr-3">
                                        {dept.hod ? dept.hod.firstName.charAt(0) : 'N'}
                                    </div>
                                    <div className="text-xs">
                                        <p className="text-gray-500">Head of Dept.</p>
                                        <p className="font-medium text-gray-900">
                                            {dept.hod ? `${dept.hod.firstName} ${dept.hod.lastName}` : 'Not Assigned'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && filteredDepartments.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                    <p>No departments found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default DepartmentList;
