import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save, Loader2, Users, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../../api/axios';
import clsx from 'clsx';

const StaffAttendanceManager = () => {
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [staffList, setStaffList] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // { staffId: status }
    const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, total: 0 });

    useEffect(() => {
        fetchData();
    }, [date]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch all staff members
            const staffRes = await api.get('/staff-attendance/staff-list');
            const fetchedStaff = staffRes.data;
            setStaffList(fetchedStaff);

            // 2. Fetch existing attendance for this date
            const attendanceRes = await api.get(`/staff-attendance?date=${date}`);
            const existingRecords = attendanceRes.data;

            const newAttendanceMap = {};
            // Default everyone to 'Present'
            fetchedStaff.forEach(s => {
                newAttendanceMap[s._id] = 'Present';
            });

            // Overwrite with existing data
            existingRecords.forEach(record => {
                if (record.staff) {
                    newAttendanceMap[record.staff._id] = record.status;
                }
            });

            setAttendanceData(newAttendanceMap);
            calculateStats(newAttendanceMap, fetchedStaff.length);
        } catch (error) {
            console.error("Failed to fetch staff attendance data", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data, total) => {
        let p = 0, a = 0, l = 0;
        Object.values(data).forEach(status => {
            if (status === 'Present') p++;
            else if (status === 'Absent') a++;
            else if (status === 'On Leave') l++;
        });
        setStats({ present: p, absent: a, leave: l, total });
    };

    const handleStatusChange = (staffId, status) => {
        const newData = { ...attendanceData, [staffId]: status };
        setAttendanceData(newData);
        calculateStats(newData, staffList.length);
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const records = Object.entries(attendanceData).map(([staffId, status]) => ({
                staffId,
                status
            }));

            await api.post('/staff-attendance', {
                date,
                records
            });
            alert('Staff attendance updated successfully!');
        } catch (error) {
            console.error("Failed to save staff attendance", error);
            alert('Failed to save attendance');
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Staff Attendance</h1>
                    <p className="text-gray-500 font-medium">Manage daily attendance for faculty and administration</p>
                </div>

                <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold">
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                        Present: {stats.present}
                    </div>
                    <div className="flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-xs font-bold">
                        <XCircle className="h-3.5 w-3.5 mr-1.5" />
                        Absent: {stats.absent}
                    </div>
                    <div className="flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold">
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        On Leave: {stats.leave}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-64">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    />
                </div>

                <div className="flex-1 text-sm text-gray-500 font-medium italic hidden md:block">
                    Total Staff Members: {staffList.length}
                </div>

                <div className="flex space-x-3 w-full md:w-auto">
                    <button
                        onClick={() => {
                            const newData = {};
                            staffList.forEach(s => newData[s._id] = 'Present');
                            setAttendanceData(newData);
                            calculateStats(newData, staffList.length);
                        }}
                        className="px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-200 transition-colors"
                    >
                        Mark All Present
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saveLoading || loading}
                        className="flex-1 md:flex-none px-8 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {saveLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                        Save Attendance
                    </button>
                </div>
            </div>

            {/* Sheet */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
                        <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Loading Staff Records...</p>
                    </div>
                ) : staffList.length === 0 ? (
                    <div className="py-24 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold">No staff members found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Staff Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Department / Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {staffList.map((staff, idx) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        key={staff._id}
                                        className="hover:bg-blue-50/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                                {staff.userId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs mr-3">
                                                    {staff.firstName[0]}
                                                </div>
                                                <span className="font-bold text-gray-900">{staff.firstName} {staff.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-600">{staff.designation}</div>
                                            <div className="text-[10px] text-gray-400 uppercase font-black">{staff.department?.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center space-x-2">
                                                {['Present', 'Absent', 'On Leave'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusChange(staff._id, status)}
                                                        className={clsx(
                                                            "px-3 py-1.5 rounded-lg text-xs font-black transition-all",
                                                            attendanceData[staff._id] === status
                                                                ? status === 'Present' ? "bg-green-600 text-white shadow-md shadow-green-200"
                                                                    : status === 'Absent' ? "bg-red-600 text-white shadow-md shadow-red-200"
                                                                        : "bg-amber-500 text-white shadow-md shadow-amber-200"
                                                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                                        )}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffAttendanceManager;
