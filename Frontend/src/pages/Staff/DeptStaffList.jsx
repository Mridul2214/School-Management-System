
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Mail, Phone, ChevronRight, Building2, User } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const DeptStaffList = () => {
    const { user } = useAuth();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const deptId = user?.department?._id || user?.department;
            const queryParam = deptId ? `?department=${deptId}` : '';
            const { data } = await api.get(`/users/department-staff${queryParam}`);
            setStaff(data);
        } catch (error) {
            console.error("Failed to fetch department staff", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staff.filter(s => {
        const matchesSearch =
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.designation?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Department Faculty</h1>
                    <p className="text-gray-500 font-medium mt-1">Directory of teaching and administrative staff in {user?.department?.name || 'your department'}</p>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name, ID or designation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white rounded-3xl border-2 border-transparent shadow-xl shadow-gray-100 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching Faculty Records...</p>
                </div>
            ) : filteredStaff.length === 0 ? (
                <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center">
                    <User className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No staff members found in this department.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredStaff.map((member, idx) => (
                            <motion.div
                                key={member._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-xl font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                                        {member.firstName[0]}{member.lastName[0]}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${member.designation?.toLowerCase().includes('hod')
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {member.designation || 'Staff'}
                                    </span>
                                </div>

                                <div className="mt-6 relative z-10">
                                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">
                                        {member.firstName} {member.lastName}
                                    </h3>
                                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{member.userId}</p>
                                </div>

                                <div className="mt-6 space-y-3 relative z-10">
                                    <div className="flex items-center text-sm text-gray-500 font-medium gap-3">
                                        <Building2 className="h-4 w-4 text-blue-400" />
                                        <span>{member.department?.name || 'No Department'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 font-medium gap-3">
                                        <Mail className="h-4 w-4 text-blue-400" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        Joined {new Date(member.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex -space-x-2">
                                        <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center">
                                            <Briefcase className="h-3 w-3 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default DeptStaffList;
