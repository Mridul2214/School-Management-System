import { useState, useEffect } from 'react';
import {
    Users, GraduationCap, Building2, TrendingUp, Briefcase, Mail, Phone, MapPin
} from 'lucide-react';
import api from '../../api/axios';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="stat-card">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        staff: 0,
        departments: 0,
        attendance: '87%'
    });
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, deptsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/departments')
                ]);

                const allUsers = usersRes.data;
                const studentList = allUsers.filter(u => u.role === 'Student');
                const staffList = allUsers.filter(u => u.role === 'Staff');

                setStats({
                    students: studentList.length,
                    staff: staffList.length,
                    departments: deptsRes.data.length,
                    attendance: '92%' // Mocked for now
                });
                setStaffMembers(staffList.slice(0, 5)); // Show first 5 staff for details
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard Data...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">System Overview</h1>

            {/* Stats Grid */}
            <div className="dashboard-grid">
                <DashboardCard
                    title="Total Students"
                    value={stats.students}
                    icon={GraduationCap}
                    color="bg-blue-600"
                />
                <DashboardCard
                    title="Total Staff"
                    value={stats.staff}
                    icon={Users}
                    color="bg-purple-600"
                />
                <DashboardCard
                    title="Departments"
                    value={stats.departments}
                    icon={Building2}
                    color="bg-emerald-600"
                />
                <DashboardCard
                    title="School Attendance"
                    value={stats.attendance}
                    icon={TrendingUp}
                    color="bg-amber-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Staff Details Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Staff Directory (Quick View)</h2>
                            <button className="text-blue-600 text-sm font-semibold hover:underline">View All Staff</button>
                        </div>
                        <div className="space-y-4">
                            {staffMembers.length > 0 ? staffMembers.map((staff, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={staff._id}
                                    className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-blue-100 transition-all group"
                                >
                                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                                        {staff.firstName[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {staff.firstName} {staff.lastName}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium flex items-center mt-0.5">
                                            <Briefcase className="h-3 w-3 mr-1" />
                                            {staff.designation || 'Faculty Member'} • {staff.department?.name || 'Academic'}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="hidden sm:flex flex-col items-end text-right mr-4">
                                            <p className="text-xs font-bold text-gray-400">{staff.email}</p>
                                            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter mt-0.5">{staff.userId}</p>
                                        </div>
                                        <span className={`h-2 w-2 rounded-full ${staff.isActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                    </div>
                                </motion.div>
                            )) : (
                                <p className="text-center py-8 text-gray-400">No staff members found.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Staff Attendance Summary */}
                <div className="space-y-4">
                    <div className="bg-gray-900 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold mb-6 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                                Staff Attendance
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-end justify-between">
                                    <div className="text-3xl font-black">94%</div>
                                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">Target: 95%</div>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '94%' }}
                                        transition={{ duration: 1.5 }}
                                        className="h-full bg-blue-500"
                                    ></motion.div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present Today</p>
                                        <p className="text-xl font-black mt-1">128</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">On Leave</p>
                                        <p className="text-xl font-black mt-1 text-red-400">14</p>
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Mark Today's Attendance
                                </button>
                            </div>
                        </div>
                        {/* Decorative background elements */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

