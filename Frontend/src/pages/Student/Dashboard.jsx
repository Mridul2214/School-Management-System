import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Book,
    Calendar,
    Clock,
    FileText,
    CreditCard,
    Award,
    ChevronRight,
    Play
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const StudentDashboard = () => {
    const { user, setUser } = useAuth(); // Get setUser to update context with live data
    const [loading, setLoading] = useState(true);
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [studentData, setStudentData] = useState({
        attendance: '85%',
        gpa: '3.8',
        credits: '12/18',
        fees: 'Paid'
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch latest profile to ensure Semester/Dept are correct
                const profileRes = await api.get('/users/profile');
                if (profileRes.data) {
                    const d = profileRes.data;
                    // Update the auth context with latest data from DB
                    const updatedUser = {
                        ...user,
                        ...d,
                        name: `${d.firstName} ${d.lastName}` // Ensure name is flattened like in login
                    };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }

                // 2. Fetch timetable
                const { data } = await api.get('/timetable/my-timetable');
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const filtered = data.filter(item => item.day === today);
                setTodaySchedule(filtered);
            } catch (error) {
                console.error("Dashboard fetch failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const stats = [
        { title: 'Attendance', value: studentData.attendance, detail: '14/16 classes today', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Current CGPA', value: studentData.gpa, detail: 'Top 10% of class', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Course Credits', value: studentData.credits, detail: 'This semester', icon: Book, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Fee Status', value: studentData.fees, detail: 'Next due: Mar 15', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    if (loading) return <div className="p-8 text-center">Loading Student Portal...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-200">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border border-white/30">
                        {user?.name?.[0]}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Hello, {user?.name}!</h1>
                        <p className="text-primary-100 mt-1 flex items-center">
                            <span className="opacity-80">{user?.department?.name || 'Department Not Set'}</span>
                            <span className="mx-2 text-white/40">•</span>
                            <span className="opacity-80">Semester {user?.semester || '1'}</span>
                        </p>
                    </div>
                    <div className="md:ml-auto flex gap-4">
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                            View Profile
                        </button>
                        <button className="bg-white text-primary-700 px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:bg-primary-50 transition-all">
                            Pay Fees
                        </button>
                    </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute right-20 -bottom-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all group"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`${stat.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase tracking-tighter">Realtime</span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-black text-gray-900 leading-none">{stat.value}</h3>
                            <p className="text-sm font-semibold text-gray-600 mt-2">{stat.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 px-2 border-l-4 border-primary-500">Upcoming Lectures</h2>
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-700">Full Schedule</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {todaySchedule.length === 0 ? (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center text-gray-400 font-medium">
                                No classes scheduled for today. Take some rest!
                            </div>
                        ) : (
                            todaySchedule.map((lecture, i) => (
                                <div key={i} className={`bg-white p-5 rounded-2xl border-l-4 border-primary-500 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow`}>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-50 h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                            {lecture.startTime}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{lecture.subject?.name}</h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Today</span>
                                                <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> Room {lecture.roomNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        <Play className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Tasks */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl shadow-gray-200">
                        <h2 className="text-lg font-bold mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-primary-400" /> Pending Assignments
                        </h2>
                        <div className="space-y-4">
                            {[
                                { subject: 'Operating Systems', task: 'Kernel Project', due: 'In 2 days' },
                                { subject: 'Web Dev', task: 'React Portfolio', due: 'In 5 days' },
                            ].map((task, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">{task.subject}</p>
                                            <h4 className="font-semibold mt-1">{task.task}</h4>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400 font-medium">Progress</span>
                                        <span className="text-[10px] text-primary-400 font-bold">{task.due}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-primary-500 w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
