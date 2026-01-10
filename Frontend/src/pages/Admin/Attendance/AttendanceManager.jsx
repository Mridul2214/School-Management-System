
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save, Check, X, Clock, Filter, Search, Loader2, BookOpen, Users } from 'lucide-react';
import api from '../../../api/axios';
import clsx from 'clsx';
// No direct CSS import needed as we use global classes

const AttendanceManager = () => {
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    // Selection State
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    // Data State
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // { studentId: 'Present' | 'Absent' | 'Late' }

    // Statistics
    const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedCourse && selectedSubject && selectedDate) {
            fetchAttendanceAndStudents();
        }
    }, [selectedCourse, selectedSubject, selectedDate]);

    // Recalculate stats whenever attendance data changes
    useEffect(() => {
        const total = students.length;
        let p = 0, a = 0, l = 0;
        Object.values(attendanceData).forEach(status => {
            if (status === 'Present') p++;
            else if (status === 'Absent') a++;
            else if (status === 'Late') l++;
        });
        setStats({ present: p, absent: a, late: l, total });
    }, [attendanceData, students]);

    const fetchInitialData = async () => {
        try {
            const coursesRes = await api.get('/courses');
            setCourses(coursesRes.data);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        }
    };

    const fetchSubjects = async (courseId) => {
        try {
            const res = await api.get(`/subjects?courseId=${courseId}`);
            setSubjects(res.data);
        } catch (error) {
            console.error("Failed to fetch subjects");
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedSubject('');
        if (courseId) fetchSubjects(courseId);
    };

    const fetchAttendanceAndStudents = async () => {
        setLoading(true);
        try {
            // 1. Fetch Students for this course
            const studentsRes = await api.get(`/attendance/students?courseId=${selectedCourse}`);
            const fetchedStudents = studentsRes.data;
            setStudents(fetchedStudents);

            // 2. Fetch existing attendance for this date/subject
            const attendanceRes = await api.get(`/attendance?date=${selectedDate}&courseId=${selectedCourse}&subjectId=${selectedSubject}`);

            const newAttendanceMap = {};

            // Initialize all students as Present by default if no record exists
            fetchedStudents.forEach(student => {
                newAttendanceMap[student._id] = 'Present';
            });

            // Overwrite with existing records
            attendanceRes.data.forEach(record => {
                if (record.student) {
                    newAttendanceMap[record.student._id] = record.status;
                }
            });

            setAttendanceData(newAttendanceMap);

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleMarkAll = (status) => {
        const newMap = {};
        students.forEach(s => newMap[s._id] = status);
        setAttendanceData(newMap);
    };

    const saveAttendance = async () => {
        setSaveLoading(true);
        try {
            const records = Object.entries(attendanceData).map(([studentId, status]) => ({
                studentId,
                status
            }));

            await api.post('/attendance', {
                date: selectedDate,
                courseId: selectedCourse,
                subjectId: selectedSubject,
                records
            });
            alert('Attendance saved successfully!');
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save attendance");
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Manager</h1>
                    <p className="text-gray-500">Mark and view daily attendance</p>
                </div>
                {students.length > 0 && (
                    <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                        <div className="px-3 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                            Present: {stats.present}
                        </div>
                        <div className="px-3 py-1 bg-red-50 text-red-700 rounded-md text-sm font-medium">
                            Absent: {stats.absent}
                        </div>
                        <div className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-md text-sm font-medium">
                            Late: {stats.late}
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                        disabled={!selectedCourse}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>

                <div>
                    <button
                        onClick={() => fetchAttendanceAndStudents()}
                        disabled={!selectedCourse || !selectedSubject}
                        className="w-full btn-primary py-2 justify-center"
                    >
                        Load Sheet
                    </button>
                </div>
            </div>

            {/* Attendance Sheet */}
            {selectedCourse && selectedSubject && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-500" />
                            <h3 className="font-semibold text-gray-700">Student List</h3>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleMarkAll('Present')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">Mark All Present</button>
                            <button onClick={() => handleMarkAll('Absent')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">Mark All Absent</button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
                        </div>
                    ) : students.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No students found for this course.
                        </div>
                    ) : (
                        <div>
                            <div className="max-h-[60vh] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center bg-green-50/50">Present</th>
                                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center bg-red-50/50">Absent</th>
                                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center bg-yellow-50/50">Late</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {students.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 font-mono text-sm text-gray-600">{student.rollNumber || student.userId || 'N/A'}</td>
                                                <td className="p-4 font-medium text-gray-900">{student.firstName} {student.lastName}</td>

                                                {/* Status Radio Buttons */}
                                                <td className="p-4 text-center bg-green-50/10">
                                                    <label className="cursor-pointer inline-flex items-center justify-center h-full w-full">
                                                        <input
                                                            type="radio"
                                                            name={`status-${student._id}`}
                                                            checked={attendanceData[student._id] === 'Present'}
                                                            onChange={() => handleStatusChange(student._id, 'Present')}
                                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                                        />
                                                    </label>
                                                </td>
                                                <td className="p-4 text-center bg-red-50/10">
                                                    <label className="cursor-pointer inline-flex items-center justify-center h-full w-full">
                                                        <input
                                                            type="radio"
                                                            name={`status-${student._id}`}
                                                            checked={attendanceData[student._id] === 'Absent'}
                                                            onChange={() => handleStatusChange(student._id, 'Absent')}
                                                            className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                                        />
                                                    </label>
                                                </td>
                                                <td className="p-4 text-center bg-yellow-50/10">
                                                    <label className="cursor-pointer inline-flex items-center justify-center h-full w-full">
                                                        <input
                                                            type="radio"
                                                            name={`status-${student._id}`}
                                                            checked={attendanceData[student._id] === 'Late'}
                                                            onChange={() => handleStatusChange(student._id, 'Late')}
                                                            className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                                                        />
                                                    </label>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
                                <button
                                    onClick={saveAttendance}
                                    disabled={saveLoading}
                                    className="btn-primary flex items-center px-8 py-3"
                                >
                                    {saveLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                                    Save Attendance Sheet
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendanceManager;
