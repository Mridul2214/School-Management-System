
import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, MapPin, User, BookOpen, Loader2 } from 'lucide-react';
import api from '../../../api/axios';

const TimetableManager = () => {
    const [loading, setLoading] = useState(false);

    // Filters
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    // Data for Modal
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // Timetable Data
    const [timetable, setTimetable] = useState([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        day: 'Monday',
        startTime: '',
        endTime: '',
        subject: '',
        teacher: '',
        roomNumber: ''
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
    ];

    useEffect(() => {
        fetchInitialData();
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (selectedCourse && selectedSemester) {
            fetchTimetable();
        }
    }, [selectedCourse, selectedSemester]);

    useEffect(() => {
        if (selectedCourse) {
            fetchSubjects(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchInitialData = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubjects = async (courseId) => {
        try {
            const res = await api.get(`/subjects?courseId=${courseId}`);
            setSubjects(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTeachers = async () => {
        try {
            // Assuming we have an endpoint or filter for getting staff members
            // For now fetching all users and filtering on frontend or use specific logic
            // Ideally: api.get('/users?role=Staff')
            const res = await api.get('/users');
            const staff = res.data.filter(u => u.role === 'Staff');
            setTeachers(staff);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/timetable?courseId=${selectedCourse}&semester=${selectedSemester}`);
            setTimetable(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this slot?')) {
            try {
                await api.delete(`/timetable/${id}`);
                fetchTimetable();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/timetable', {
                ...formData,
                course: selectedCourse,
                semester: selectedSemester
            });
            setIsModalOpen(false);
            fetchTimetable();
            // Reset form partly
            setFormData(prev => ({ ...prev, startTime: '', endTime: '', subject: '', teacher: '', roomNumber: '' }));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add entry');
        }
    };

    const handleAutoGenerate = async () => {
        if (!selectedCourse || !selectedSemester) return alert("Select Course and Semester first");
        if (!window.confirm("This will overwrite the existing timetable for this semester. Continue?")) return;

        setLoading(true);
        try {
            await api.post('/timetable/generate', { courseId: selectedCourse, semester: selectedSemester });
            fetchTimetable();
            alert("Timetable Auto-Generated Successfully!");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Generation Failed. Ensure Subjects have assigned Faculty.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Timetable Manager</h1>
                    <p className="text-gray-500">Schedule classes and manage routines</p>
                </div>
                {selectedCourse && selectedSemester && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleAutoGenerate}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center transition"
                            disabled={loading}
                        >
                            <Calendar className="h-4 w-4 mr-2" />
                            Auto Generate
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Class
                        </button>
                    </div>
                )}
            </div>

            {/* Selection Bar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <input
                        type="number"
                        min="1"
                        max="8"
                        placeholder="e.g. 1"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    />
                </div>
            </div>

            {/* Timetable Grid */}
            {!selectedCourse || !selectedSemester ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Please select a Course and Semester to view the timetable.</p>
                </div>
            ) : loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {days.map(day => {
                        const dayClasses = timetable.filter(t => t.day === day);
                        // Sort by start time just in case
                        dayClasses.sort((a, b) => a.startTime.localeCompare(b.startTime));

                        return (
                            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 font-semibold text-gray-700 flex justify-between items-center">
                                    <span>{day}</span>
                                    <span className="text-xs font-normal text-gray-400">{dayClasses.length} Classes</span>
                                </div>
                                <div className="p-6">
                                    {dayClasses.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">No classes scheduled</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {dayClasses.map(session => (
                                                <div key={session._id} className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-200">
                                                    <button
                                                        onClick={() => handleDelete(session._id)}
                                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                    <div className="flex items-center text-blue-600 mb-2">
                                                        <Clock className="h-4 w-4 mr-1.5" />
                                                        <span className="text-sm font-semibold">{session.startTime} - {session.endTime}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 mb-1">{session.subject.name}</h3>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <User className="h-3 w-3 mr-1.5" />
                                                            {session.teacher.firstName} {session.teacher.lastName}
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <MapPin className="h-3 w-3 mr-1.5" />
                                                            Room: {session.roomNumber}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Class Modal - Simplified inline for now, better to extract */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Add Class Schedule</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                <select
                                    value={formData.day}
                                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg outline-none"
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                                <select
                                    value={formData.teacher}
                                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg outline-none"
                                    required
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 301-A"
                                    value={formData.roomNumber}
                                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg outline-none"
                                    required
                                />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Add to Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableManager;
