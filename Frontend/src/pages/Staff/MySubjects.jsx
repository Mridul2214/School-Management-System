import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Users, Clock, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const MySubjects = () => {
    const { user } = useAuth();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMySubjects = async () => {
            try {
                // In production: api.get(`/subjects/faculty/${user.id}`)
                const { data } = await api.get('/subjects');
                // Mock filtering to simulate "My Subjects"
                const mySubs = data.filter(s => s.faculty?._id === user?._id || s.faculty === user?._id);
                setSubjects(mySubs);
            } catch (error) {
                console.error("Error fetching subjects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMySubjects();
    }, [user]);

    if (loading) return <div className="p-8 text-center">Loading Subjects...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Assigned Subjects</h1>
                <p className="text-gray-500">Manage your curriculum and student performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((sub, index) => (
                    <motion.div
                        key={sub._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary-50 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    <Book className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase">{sub.code}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{sub.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{sub.course?.name || 'Computer Science'} • Sem {sub.semester}</p>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Users className="h-4 w-4 opacity-70" />
                                    <span className="text-xs font-medium">64 Students</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <Clock className="h-4 w-4 opacity-70" />
                                    <span className="text-xs font-medium">{sub.credits} Credits</span>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-primary-50 transition-colors">
                            <span className="text-xs font-bold text-primary-600">VIEW CURRICULUM</span>
                            <ChevronRight className="h-4 w-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MySubjects;
