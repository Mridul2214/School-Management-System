import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, Download, AlertCircle, Calendar } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StudentFees = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [fees, setFees] = useState([
        { title: 'Tution Fee', semester: 'Sem 4', amount: '45,000', status: 'Paid', date: '2025-12-10' },
        { title: 'Examination Fee', semester: 'Sem 4', amount: '2,500', status: 'Pending', date: '2026-03-15' },
        { title: 'Library Fee', semester: 'Annual', amount: '1,000', status: 'Paid', date: '2025-08-05' },
    ]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => setLoading(false), 800);
    }, []);

    if (loading) return <div className="p-8 text-center text-primary-600">Loading Fee Structure...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Overview</h1>
                    <p className="text-gray-500 font-medium">Manage your payments and download receipts</p>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-xl">
                    <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Enrollment No:</span>
                    <p className="text-sm font-black text-primary-900">2026CS1082</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Outstanding Balance */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Transaction logs for Academic Year 2025-26</p>
                            </div>
                            <button className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                <Download className="h-4 w-4 mr-2" />
                                DOWNLOAD STATEMENT
                            </button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {fees.map((fee, i) => (
                                <div key={i} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${fee.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                            <CreditCard className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{fee.title}</h4>
                                            <p className="text-xs font-semibold text-gray-400 mt-0.5">{fee.semester} • Due {fee.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-8">
                                        <div className="text-right">
                                            <p className="text-lg font-black text-gray-900">₹{fee.amount}</p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${fee.status === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                                {fee.status}
                                            </p>
                                        </div>
                                        {fee.status === 'Paid' ? (
                                            <button className="h-10 w-10 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                                                <Download className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button className="h-10 px-6 bg-primary-600 text-white font-bold rounded-xl text-xs hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                                                PAY NOW
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="space-y-6">
                    <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold opacity-80">Total Outstanding</h3>
                            <p className="text-4xl font-black mt-2">₹2,500</p>
                            <div className="h-px w-full bg-white/10 my-6"></div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="opacity-60 font-medium">Next Due Date</span>
                                    <span className="font-bold">Mar 15, 2026</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="opacity-60 font-medium">Fine (If any)</span>
                                    <span className="font-bold text-orange-400">₹0.00</span>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-4 bg-white text-indigo-900 font-black rounded-2xl shadow-xl shadow-black/20 hover:scale-[1.02] transition-transform">
                                PROCEED TO PAY
                            </button>
                        </div>
                        {/* Abstract circle decor */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full"></div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start space-x-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Scholarship Applied</h4>
                            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">Your merit-based scholarship has been applied to the Semester 4 tuition fee.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentFees;
