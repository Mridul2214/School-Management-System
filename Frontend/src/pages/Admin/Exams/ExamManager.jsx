import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Book, Trophy, Search, Loader2, Save, Trash2, Edit } from 'lucide-react';
import api from '../../../api/axios';
import clsx from 'clsx';

const ExamManager = () => {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newExam, setNewExam] = useState({
        name: '',
        type: 'Monthly Test',
        course: '',
        semester: 1,
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchExams();
        fetchCourses();
    }, []);

    const fetchExams = async () => {
        try {
            const { data } = await api.get('/exams');
            setExams(data);
        } catch (error) {
            console.error("Failed to fetch exams", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            await api.post('/exams', newExam);
            setIsAdding(false);
            fetchExams();
            setNewExam({
                name: '',
                type: 'Monthly Test',
                course: '',
                semester: 1,
                startDate: '',
                endDate: ''
            });
        } catch (error) {
            console.error("Failed to create exam", error);
            alert("Error creating exam");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Examinations</h1>
                    <p className="text-gray-500 font-medium">Schedule and manage academic assessments</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {isAdding ? 'Cancel' : 'Schedule Exam'}
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <form onSubmit={handleCreateExam} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name</label>
                            <input
                                type="text"
                                required
                                value={newExam.name}
                                onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                                placeholder="e.g. Spring Mid-Term 2026"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type</label>
                            <select
                                value={newExam.type}
                                onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                                className="input-field"
                            >
                                <option>Monthly Test</option>
                                <option>Mid Term</option>
                                <option>Final Exam</option>
                                <option>Practical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Course</label>
                            <select
                                required
                                value={newExam.course}
                                onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Semester</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="8"
                                value={newExam.semester}
                                onChange={(e) => setNewExam({ ...newExam, semester: parseInt(e.target.value) })}
                                className="input-field"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newExam.startDate}
                                    onChange={(e) => setNewExam({ ...newExam, startDate: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newExam.endDate}
                                    onChange={(e) => setNewExam({ ...newExam, endDate: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-3 flex justify-end">
                            <button type="submit" className="btn-primary px-10">Schedule Exam Session</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Exam List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400">Loading Exam Schedules...</div>
                ) : exams.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        No exams scheduled yet.
                    </div>
                ) : (
                    exams.map((exam, idx) => (
                        <motion.div
                            key={exam._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <span className={clsx(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                    exam.status === 'Scheduled' ? "bg-blue-100 text-blue-700" :
                                        exam.status === 'Ongoing' ? "bg-green-100 text-green-700 animate-pulse" :
                                            "bg-gray-100 text-gray-700"
                                )}>
                                    {exam.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">{exam.name}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-4">
                                {exam.type} • {exam.course?.name} • Sem {exam.semester}
                            </p>

                            <div className="space-y-3 pt-4 border-t border-gray-50">
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-400 w-24">Starts:</span>
                                    <span className="font-bold text-gray-700">{new Date(exam.startDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="text-gray-400 w-24">Ends:</span>
                                    <span className="font-bold text-gray-700">{new Date(exam.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-3 bg-gray-50 text-gray-600 font-bold rounded-xl text-sm hover:bg-blue-600 hover:text-white transition-all">
                                Manage Results
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExamManager;
