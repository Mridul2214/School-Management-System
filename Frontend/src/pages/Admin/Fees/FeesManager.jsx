
import { useState, useEffect } from 'react';
import { DollarSign, Plus, Ticket, CreditCard, Search, User, Calendar, FileText } from 'lucide-react';
import api from '../../../api/axios';
import { motion } from 'framer-motion';

const FeesManager = () => {
    const [activeTab, setActiveTab] = useState('structure'); // structure | payments
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fee Form
    const [showFeeModal, setShowFeeModal] = useState(false);
    const [feeForm, setFeeForm] = useState({
        name: '', type: 'Tuition', amount: '', dueDate: '',
        description: '', department: '', course: '', semester: ''
    });

    // Payment Form
    const [showPayModal, setShowPayModal] = useState(false);
    const [payForm, setPayForm] = useState({
        studentId: '', feeId: '', amountPaid: '', method: 'Cash', transactionId: '', remarks: ''
    });
    const [studentSearch, setStudentSearch] = useState('');
    const [foundStudents, setFoundStudents] = useState([]);

    // Data for dropdowns
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchFees();
        fetchDepsAndCourses();
    }, []);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/fees');
            setFees(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepsAndCourses = async () => {
        try {
            const [d, c] = await Promise.all([
                api.get('/departments'),
                api.get('/courses')
            ]);
            setDepartments(d.data);
            setCourses(c.data);
        } catch (error) { console.error(error); }
    };

    const handleCreateFee = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fees', feeForm);
            setShowFeeModal(false);
            fetchFees();
            setFeeForm({ name: '', type: 'Tuition', amount: '', dueDate: '', description: '', department: '', course: '', semester: '' });
        } catch (error) { alert("Failed to create fee"); }
    };

    const searchStudent = async (query) => {
        setStudentSearch(query);
        if (query.length > 2) {
            try {
                // Currently just fetching all and filtering - ideally backend search
                const { data } = await api.get('/users');
                const students = data.filter(u =>
                    u.role === 'Student' &&
                    (u.firstName.toLowerCase().includes(query) || u.email.includes(query) || u.userId?.includes(query))
                );
                setFoundStudents(students);
            } catch (e) { }
        } else {
            setFoundStudents([]);
        }
    };

    const selectStudent = (student) => {
        setPayForm({ ...payForm, studentId: student._id });
        setStudentSearch(`${student.firstName} ${student.lastName} (${student.userId})`);
        setFoundStudents([]);
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fees/pay', payForm);
            setShowPayModal(false);
            alert("Payment Recorded Successfully");
            setPayForm({ studentId: '', feeId: '', amountPaid: '', method: 'Cash', transactionId: '', remarks: '' });
            setStudentSearch('');
        } catch (error) { alert("Failed to record payment"); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fees & Payments</h1>
                    <p className="text-gray-500">Manage fee structures and collect payments</p>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                    <button
                        onClick={() => setActiveTab('structure')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'structure' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Fee Structures
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                        Record Payment
                    </button>
                </div>
            </div>

            {activeTab === 'structure' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={() => setShowFeeModal(true)} className="btn-primary flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Fee
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fees.map(fee => (
                            <motion.div
                                key={fee._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Ticket className="h-6 w-6" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">${fee.amount.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold">{fee.type}</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{fee.name}</h3>
                                {fee.department && <p className="text-sm text-gray-500">Dept: {fee.department.name}</p>}
                                {fee.course && <p className="text-sm text-gray-500">Course: {fee.course.name}</p>}
                                {fee.dueDate && (
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-sm text-red-500 font-medium">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                        Record New Payment
                    </h2>
                    <form onSubmit={handleRecordPayment} className="space-y-6">
                        {/* Student Search */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={studentSearch}
                                    onChange={(e) => searchStudent(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            {foundStudents.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {foundStudents.map(s => (
                                        <div
                                            key={s._id}
                                            onClick={() => selectStudent(s)}
                                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                                        >
                                            <p className="font-medium text-gray-900">{s.firstName} {s.lastName}</p>
                                            <p className="text-xs text-gray-500">{s.userId} • {s.email}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fee Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                            <select
                                required
                                value={payForm.feeId}
                                onChange={(e) => setPayForm({ ...payForm, feeId: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                            >
                                <option value="">Select Fee</option>
                                {fees.map(f => (
                                    <option key={f._id} value={f._id}>{f.name} - ${f.amount}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="number"
                                        required
                                        value={payForm.amountPaid}
                                        onChange={(e) => setPayForm({ ...payForm, amountPaid: e.target.value })}
                                        className="w-full pl-9 pr-4 py-2 border rounded-lg outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={payForm.method}
                                    onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg outline-none"
                                >
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>Online</option>
                                    <option>Cheque</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / Ref</label>
                            <input
                                type="text"
                                value={payForm.transactionId}
                                onChange={(e) => setPayForm({ ...payForm, transactionId: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                            <textarea
                                value={payForm.remarks}
                                onChange={(e) => setPayForm({ ...payForm, remarks: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none"
                                rows="2"
                            ></textarea>
                        </div>

                        <button type="submit" className="w-full btn-primary py-3 justify-center">
                            Confirm Payment
                        </button>
                    </form>
                </div>
            )}

            {/* Create Fee Modal */}
            {showFeeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Create Fee Structure</h3>
                            <button onClick={() => setShowFeeModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleCreateFee} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Fee Name</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={feeForm.name} onChange={e => setFeeForm({ ...feeForm, name: e.target.value })} placeholder="e.g. Sem 1 Tuition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={feeForm.type} onChange={e => setFeeForm({ ...feeForm, type: e.target.value })}>
                                        {['Tuition', 'Library', 'Hostel', 'Transport', 'Exam', 'Other'].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Amount</label>
                                    <input required type="number" className="w-full px-3 py-2 border rounded-lg" value={feeForm.amount} onChange={e => setFeeForm({ ...feeForm, amount: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Department (Opt)</label>
                                    <select className="w-full px-3 py-2 border rounded-lg" value={feeForm.department} onChange={e => setFeeForm({ ...feeForm, department: e.target.value })}>
                                        <option value="">All Departments</option>
                                        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Due Date</label>
                                    <input type="date" className="w-full px-3 py-2 border rounded-lg" value={feeForm.dueDate} onChange={e => setFeeForm({ ...feeForm, dueDate: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary py-2 justify-center">Create Fee</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeesManager;
