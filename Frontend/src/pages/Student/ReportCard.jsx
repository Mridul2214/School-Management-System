import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, FileText, Download, TrendingUp, AlertCircle, Loader2, Award } from 'lucide-react';
import api from '../../api/axios';
import clsx from 'clsx';

const StudentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const { data } = await api.get('/exams/my-results');
            setResults(data);
        } catch (error) {
            console.error("Failed to fetch results", error);
        } finally {
            setLoading(false);
        }
    };

    // Group results by Exam
    const groupedResults = results.reduce((acc, result) => {
        const examName = result.exam?.name || 'Other';
        if (!acc[examName]) acc[examName] = [];
        acc[examName].push(result);
        return acc;
    }, {});

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Generating Report Card...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Academic Results</h1>
                    <p className="text-gray-500 font-medium">Track your performance and grades across semesters</p>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                    <Download className="h-4 w-4" />
                    <span>Download All</span>
                </button>
            </div>

            {results.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                    <Trophy className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-400">No results published yet.</h2>
                    <p className="text-gray-500 mt-2">Your marks will appear here once faculty uploads them.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedResults).map(([examName, examMarks], idx) => {
                        const totalObtained = examMarks.reduce((sum, m) => sum + m.marksObtained, 0);
                        const totalPossible = examMarks.reduce((sum, m) => sum + m.totalMarks, 0);
                        const percentage = ((totalObtained / totalPossible) * 100).toFixed(1);

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={examName}
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                {/* Exam Header Card */}
                                <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                            <Award className="h-8 w-8 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black">{examName}</h2>
                                            <p className="text-blue-100 font-medium opacity-80">{examMarks[0]?.exam?.type} • Released {new Date(examMarks[0]?.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
                                        <div className="text-3xl font-black">{percentage}%</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Aggregate Score</div>
                                    </div>
                                </div>

                                {/* Marks Table */}
                                <div className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-50">
                                                    <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                                                    <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Marks</th>
                                                    <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Total</th>
                                                    <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Grade</th>
                                                    <th className="px-4 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 text-sm">
                                                {examMarks.map((mark) => (
                                                    <tr key={mark._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-4 py-4">
                                                            <div className="font-bold text-gray-900">{mark.subject?.name}</div>
                                                            <div className="text-[10px] text-gray-400 font-mono font-bold uppercase">{mark.subject?.code}</div>
                                                        </td>
                                                        <td className="px-4 py-4 text-center font-black text-blue-600">
                                                            {mark.marksObtained}
                                                        </td>
                                                        <td className="px-4 py-4 text-center text-gray-500 font-medium">
                                                            {mark.totalMarks}
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            <span className={clsx(
                                                                "px-3 py-1.5 rounded-lg text-xs font-black",
                                                                mark.grade === 'A+' || mark.grade === 'A' ? "bg-green-100 text-green-700" :
                                                                    mark.grade === 'B' ? "bg-blue-100 text-blue-700" :
                                                                        mark.grade === 'F' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                                                            )}>
                                                                {mark.grade}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-gray-500 italic text-xs">
                                                            {mark.feedback || 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentResults;
