import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Filter, Calendar } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StudentAttendance = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0
    });

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                // In a real app we'd fetch specific student attendance
                const { data } = await api.get('/attendance');
                // Mock filtering for this student
                const myAttendance = data.slice(0, 10).map(item => ({
                    ...item,
                    subject: item.subject?.name || 'Mathematics',
                    status: Math.random() > 0.2 ? 'Present' : 'Absent',
                    date: new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0]
                }));

                setAttendance(myAttendance);
                const p = myAttendance.filter(a => a.status === 'Present').length;
                setSummary({
                    total: myAttendance.length,
                    present: p,
                    absent: myAttendance.length - p,
                    percentage: Math.round((p / myAttendance.length) * 100)
                });
            } catch (error) {
                console.error("Failed to load attendance", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Attendance...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
                    <p className="text-gray-500">Track your class participation and requirements</p>
                </div>
                <div className="flex items-center space-x-2 bg-white p-2 border border-gray-100 rounded-xl shadow-sm">
                    <Calendar className="h-4 w-4 text-primary-500" />
                    <span className="text-sm font-semibold">Jan 2026 - Present</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Overall Attendance</p>
                    <div className="mt-2 flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-primary-600">{summary.percentage}%</span>
                        <span className="text-xs font-semibold text-green-500">↑ 2%</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Classes</p>
                    <h3 className="text-3xl font-black text-gray-900 mt-2">{summary.total}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase text-green-600">Present</p>
                    <h3 className="text-3xl font-black text-green-600 mt-2">{summary.present}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase text-red-600">Absent</p>
                    <h3 className="text-3xl font-black text-red-600 mt-2">{summary.absent}</h3>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Detailed History</h2>
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <Filter className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Subject</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
                                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {attendance.map((record, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-gray-700">{record.date}</td>
                                    <td className="p-4 text-sm font-bold text-gray-900">{record.subject}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            {record.status === 'Present' ? (
                                                <span className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> PRESENT
                                                </span>
                                            ) : (
                                                <span className="flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">
                                                    <XCircle className="h-3 w-3 mr-1" /> ABSENT
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-gray-400 font-medium">Regular Class</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;
