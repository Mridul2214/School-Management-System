import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    BookOpen,
    Calendar,
    Clock,
    CheckCircle,
    MessageSquare,
    Bell,
    TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const StaffDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 0,
        mySubjects: 0,
        todayClasses: 0,
        pendingAttendances: 0
    });
    const [loading, setLoading] = useState(true);

    const [todaySchedule, setTodaySchedule] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats and today's schedule
                const [studentsRes, subjectsRes, scheduleRes] = await Promise.all([
                    api.get('/users?role=Student'),
                    api.get('/subjects'),
                    api.get('/timetable/my-schedule')
                ]);

                // Filter for "Today"
                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                const todayClasses = scheduleRes.data.filter(s => s.day === today);
                setTodaySchedule(todayClasses);

                // Mocking filtering for "My" data based on logged in staff
                const mySubjects = subjectsRes.data.filter(s => s.faculty?._id === user?.id || s.faculty === user?.id);

                setStats({
                    totalStudents: studentsRes.data.length,
                    mySubjects: mySubjects.length || 2,
                    todayClasses: todayClasses.length,
                    pendingAttendances: 1
                });
            } catch (error) {
                console.error("Dashboard data load failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    const statCards = [
        { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'My Subjects', value: stats.mySubjects, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: "Today's Classes", value: stats.todayClasses, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Pending Attendance', value: stats.pendingAttendances, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back, {user?.name}</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening in your classes today.</p>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    <Clock className="h-4 w-4 text-primary-500" />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                            </div>
                            <div className={`${card.bg} p-3 rounded-xl`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            <span>+4% from last week</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
                            <button className="text-primary-600 text-sm font-semibold hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {todaySchedule.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 font-medium">No classes scheduled for today.</div>
                            ) : (
                                todaySchedule.map((item, i) => (
                                    <div key={i} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-center min-w-[70px]">
                                                <p className="text-sm font-bold text-gray-900">{item.startTime}</p>
                                                <p className="text-xs text-gray-500">{item.endTime}</p>
                                            </div>
                                            <div className="h-10 w-px bg-gray-100"></div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{item.subject?.name}</h4>
                                                <p className="text-sm text-gray-500">{item.course?.name} • Room {item.roomNumber}</p>
                                            </div>
                                        </div>
                                        <button className="btn-secondary py-2 px-4 text-xs">Mark Attendance</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications/Recent Activities */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Recent Updates</h2>
                            <Bell className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'Leave Application', desc: 'Sarah John applied for sick leave', time: '2h ago', color: 'bg-orange-100 text-orange-600' },
                                { title: 'Grade Submission', desc: 'Deadline for CS201 is tomorrow', time: '5h ago', color: 'bg-red-100 text-red-600' },
                                { title: 'Doubt Resolved', desc: 'Replied to Mark\'s query on Discord', time: '1d ago', color: 'bg-blue-100 text-blue-600' },
                            ].map((note, i) => (
                                <div key={i} className="flex space-x-4">
                                    <div className={`mt-1 h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center ${note.color}`}>
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{note.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{note.desc}</p>
                                        <span className="text-[10px] text-gray-400 mt-1 block font-medium uppercase tracking-wider">{note.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
