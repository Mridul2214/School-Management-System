import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, Search, Trophy, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import api from '../../api/axios';
import clsx from 'clsx';

const MarksEntry = () => {
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // Selection state
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    // UI State
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [marksData, setMarksData] = useState({}); // { studentId: { marksObtained, totalMarks, grade, feedback } }

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [examsRes, subjectsRes] = await Promise.all([
                api.get('/exams'),
                api.get('/subjects')
            ]);
            setExams(examsRes.data);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        }
    };

    const fetchStudentsAndMarks = async () => {
        if (!selectedExam || !selectedSubject) return;
        setLoading(true);
        try {
            // Find exam details to get courseId
            const exam = exams.find(e => e._id === selectedExam);

            // 1. Fetch Students for this course/semester
            const studentsRes = await api.get(`/attendance/students?courseId=${exam.course._id}&semester=${exam.semester}`);
            const fetchedStudents = studentsRes.data;
            setStudents(fetchedStudents);

            // 2. Fetch existing marks
            const marksRes = await api.get(`/exams/marks?examId=${selectedExam}&subjectId=${selectedSubject}`);
            const existingMarks = marksRes.data;

            const newMarksMap = {};
            fetchedStudents.forEach(s => {
                newMarksMap[s._id] = {
                    marksObtained: '',
                    totalMarks: 100,
                    grade: '',
                    feedback: ''
                };
            });

            existingMarks.forEach(m => {
                if (m.student) {
                    newMarksMap[m.student._id] = {
                        marksObtained: m.marksObtained,
                        totalMarks: m.totalMarks,
                        grade: m.grade,
                        feedback: m.feedback
                    };
                }
            });

            setMarksData(newMarksMap);
        } catch (error) {
            console.error("Failed to load students/marks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkChange = (studentId, field, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const calculateGrade = (marks, total) => {
        const percentage = (marks / total) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    const handleAutoFillGrades = () => {
        const newData = { ...marksData };
        Object.keys(newData).forEach(id => {
            if (newData[id].marksObtained !== '') {
                newData[id].grade = calculateGrade(newData[id].marksObtained, newData[id].totalMarks);
            }
        });
        setMarksData(newData);
    };

    const handleSave = async () => {
        setSaveLoading(true);
        try {
            const dataToSave = Object.entries(marksData).map(([studentId, data]) => ({
                studentId,
                ...data
            })).filter(d => d.marksObtained !== '');

            await api.post('/exams/marks', {
                examId: selectedExam,
                subjectId: selectedSubject,
                marksData: dataToSave
            });
            alert('Marks saved successfully!');
        } catch (error) {
            console.error("Save failed", error);
            alert('Failed to save marks');
        } finally {
            setSaveLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">Marks Entry</h1>
                <p className="text-gray-500 font-medium">Record student performance for examination sessions</p>
            </div>

            {/* Selection Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Examination</label>
                    <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Exam Session</option>
                        {exams.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>
                <button
                    onClick={fetchStudentsAndMarks}
                    disabled={!selectedExam || !selectedSubject || loading}
                    className="btn-primary py-3 justify-center"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Load Marksheet'}
                </button>
            </div>

            {students.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center text-sm font-bold text-gray-600">
                            <Trophy className="h-4 w-4 mr-2 text-amber-500" />
                            {students.length} Students listed
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleAutoFillGrades}
                                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50"
                            >
                                Auto-calculate Grades
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saveLoading}
                                className="px-6 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black shadow-lg shadow-blue-100 hover:scale-105 transition-all flex items-center"
                            >
                                {saveLoading ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <Save className="h-3 w-3 mr-2" />}
                                Save Marks
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Roll No</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-24">Marks</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-24">Total</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest w-20">Grade</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Feedback / Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student, idx) => (
                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-gray-400">
                                                {student.rollNumber || student.userId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={marksData[student._id]?.marksObtained}
                                                onChange={(e) => handleMarkChange(student._id, 'marksObtained', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={marksData[student._id]?.totalMarks}
                                                onChange={(e) => handleMarkChange(student._id, 'totalMarks', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                maxLength="2"
                                                value={marksData[student._id]?.grade}
                                                onChange={(e) => handleMarkChange(student._id, 'grade', e.target.value.toUpperCase())}
                                                className="w-full px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm font-black text-blue-700 text-center uppercase"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                placeholder="Remarks..."
                                                value={marksData[student._id]?.feedback}
                                                onChange={(e) => handleMarkChange(student._id, 'feedback', e.target.value)}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarksEntry;
