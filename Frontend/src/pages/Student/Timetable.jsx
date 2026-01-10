import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, User, Calendar as CalendarIcon, Loader2, BookOpen } from 'lucide-react';
import api from '../../api/axios';
import clsx from 'clsx';

const StudentTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const { data } = await api.get('/timetable/my-timetable');
            setTimetable(data);
        } catch (error) {
            console.error("Failed to fetch timetable", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTimetable = timetable.filter(item => item.day === activeDay);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Loading your schedule...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Weekly Timetable</h1>
                    <p className="text-gray-500 font-medium">Your academic schedule for the current semester</p>
                </div>
                <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                    {days.map(day => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={clsx(
                                "px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap",
                                activeDay === day
                                    ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            )}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredTimetable.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100"
                >
                    <CalendarIcon className="h-16 w-16 text-gray-100 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-400">No classes scheduled for {activeDay}</h2>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTimetable.map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all group relative overflow-hidden"
                        >
                            {/* Time Badge */}
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {item.startTime} - {item.endTime}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 group-hover:text-primary-700 transition-colors uppercase tracking-tight">
                                    {item.subject?.name}
                                </h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.subject?.code}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600 font-medium">
                                    <User className="h-4 w-4 mr-3 text-gray-400" />
                                    <span>Prof. {item.teacher?.firstName} {item.teacher?.lastName}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 font-medium">
                                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                                    <span>Room: <span className="text-primary-600 font-bold">{item.roomNumber}</span></span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 font-medium">
                                    <Clock className="h-4 w-4 mr-3 text-gray-400" />
                                    <span>60 Minutes Session</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 text-[8px] flex items-center justify-center font-bold text-gray-400">
                                            ST
                                        </div>
                                    ))}
                                    <div className="h-6 w-6 rounded-full border-2 border-white bg-primary-50 text-[8px] flex items-center justify-center font-bold text-primary-600">
                                        +24
                                    </div>
                                </div>
                                <button className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline">
                                    Join Class
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentTimetable;
