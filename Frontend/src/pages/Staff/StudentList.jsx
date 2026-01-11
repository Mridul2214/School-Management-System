
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, GraduationCap, MapPin, Mail, Phone, ChevronRight, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StudentList = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('All');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            // Fetch students for the staff's department by default
            const deptId = user?.department?._id || user?.department;
            const queryParam = deptId ? `?department=${deptId}` : '';
            const { data } = await api.get(`/users/students${queryParam}`);
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch department students", error);
        } finally {
            setLoading(false);
        }
    };

    const semesters = ['All', '1', '2', '3', '4', '5', '6', '7', '8'];

    const filteredStudents = students.filter(s => {
        const matchesSearch =
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.userId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = semesterFilter === 'All' || s.semester?.toString() === semesterFilter;
        return matchesSearch && matchesSemester;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Department Students</h1>
                    <p className="text-gray-500 font-medium mt-1">Directory of students enrolled in {user?.department?.name || 'your department'}</p>
                </div>

                <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                    {semesters.map(sem => (
                        <button
                            key={sem}
                            onClick={() => setSemesterFilter(sem)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${semesterFilter === sem
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {sem === 'All' ? 'All Sems' : `Sem ${sem}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name or registration number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white rounded-3xl border-2 border-transparent shadow-xl shadow-gray-100 focus:border-primary-500 focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium"
                />
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Student Portal...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-center">
                    <Users className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No students found matching your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredStudents.map((student, idx) => (
                            <motion.div
                                key={student._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-primary-100 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-xl font-black text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors shadow-inner">
                                        {student.firstName[0]}{student.lastName[0]}
                                    </div>
                                    <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        Semester {student.semester}
                                    </span>
                                </div>

                                <div className="mt-6 relative z-10">
                                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-primary-700 transition-colors">
                                        {student.firstName} {student.lastName}
                                    </h3>
                                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{student.userId}</p>
                                </div>

                                <div className="mt-6 space-y-3 relative z-10">
                                    {/* Course display removed */}
                                    <div className="flex items-center text-sm text-gray-500 font-medium gap-3">
                                        <Mail className="h-4 w-4 text-primary-400" />
                                        <span className="truncate">{student.email}</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                                    <button className="text-xs font-black text-primary-600 uppercase tracking-widest flex items-center group/btn">
                                        View Profile
                                        <ChevronRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 shadow-sm"></div>
                                        ))}
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

export default StudentList;
