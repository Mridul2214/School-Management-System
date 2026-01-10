
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, Filter, User, Shield, Briefcase, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';


const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
                alert('User removed successfully');
            } catch (error) {
                console.error('Failed to delete user', error);
                alert(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const roles = ['All', 'Administrator', 'Staff', 'Student'];

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Administrator': return <Shield className="h-4 w-4 text-purple-600" />;
            case 'Staff': return <Briefcase className="h-4 w-4 text-blue-600" />;
            case 'Student': return <GraduationCap className="h-4 w-4 text-green-600" />;
            default: return <User className="h-4 w-4 text-gray-600" />;
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'Administrator': return 'bg-purple-100 text-purple-700';
            case 'Staff': return 'bg-blue-100 text-blue-700';
            case 'Student': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Staff Management</h1>
                    <p className="page-subtitle">Manage system administrators, HODs, and teaching staff</p>
                </div>
                <Link to="/admin/users/add" className="btn-primary flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                </Link>
            </div>

            <div className="search-bar-container flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                    <Filter className="h-4 w-4 text-gray-400" />
                    {roles.map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${roleFilter === role
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="card-grid">
                    {filteredUsers.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="item-card flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 ${getRoleBadgeColor(user.role)}`}>
                                        {getRoleIcon(user.role)}
                                        {user.role}
                                        {user.designation?.toLowerCase().includes('hod') && (
                                            <span className="ml-1 bg-amber-500 text-white px-1.5 rounded-sm text-[10px]">HOD</span>
                                        )}
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                                            className="action-btn"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="action-btn-danger"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">ID</span>
                                        <span className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                            {user.userId || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Status</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
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

export default UserList;
