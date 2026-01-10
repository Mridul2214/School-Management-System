import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Clock,
    Tag,
    AlertCircle,
    Loader2
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const AcademicCalendar = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAdding, setIsAdding] = useState(false);

    // Form State for Admin
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'Event',
        category: '',
        color: '#3b82f6'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/academic-calendar');
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/academic-calendar', newEvent);
            setIsAdding(false);
            fetchEvents();
            setNewEvent({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                type: 'Event',
                category: '',
                color: '#3b82f6'
            });
        } catch (error) {
            console.error("Failed to add event", error);
            alert("Error adding event");
        }
    };

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 border border-gray-50 bg-gray-50/30"></div>);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = new Date(year, month, day).toISOString().split('T')[0];
            const dayEvents = events.filter(e => {
                const start = e.startDate.split('T')[0];
                const end = e.endDate.split('T')[0];
                return dateStr >= start && dateStr <= end;
            });

            days.push(
                <div key={day} className="h-32 border border-gray-50 p-2 relative group hover:bg-blue-50/10 transition-colors">
                    <span className={clsx(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1",
                        dateStr === new Date().toISOString().split('T')[0] ? "bg-primary-600 text-white" : "text-gray-400"
                    )}>
                        {day}
                    </span>
                    <div className="space-y-1 overflow-y-auto max-h-20 scrollbar-hide">
                        {dayEvents.map((event, i) => (
                            <div
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[8px] font-bold text-white truncate shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                style={{ backgroundColor: event.color || '#3b82f6' }}
                                title={event.title}
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Loading Calendar...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Academic Calendar</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Important dates, holidays and institutional events</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
                        <span className="px-4 text-sm font-black text-gray-700 min-w-[140px] text-center">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                    {user?.role === 'Administrator' && (
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="btn-primary flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {isAdding ? 'Cancel' : 'Post Event'}
                        </button>
                    )}
                </div>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
                >
                    <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Event Title</label>
                            <input
                                required
                                value={newEvent.title}
                                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="input-field"
                                placeholder="e.g. Annual Sports Meet 2026"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Type</label>
                            <select
                                value={newEvent.type}
                                onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                className="input-field"
                            >
                                <option>Event</option>
                                <option>Holiday</option>
                                <option>Exam</option>
                                <option>Academic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Theme Color</label>
                            <input
                                type="color"
                                value={newEvent.color}
                                onChange={e => setNewEvent({ ...newEvent, color: e.target.value })}
                                className="h-12 w-full p-1 bg-white border border-gray-200 rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Start Date</label>
                            <input
                                type="date"
                                required
                                value={newEvent.startDate}
                                onChange={e => setNewEvent({ ...newEvent, startDate: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">End Date</label>
                            <input
                                type="date"
                                required
                                value={newEvent.endDate}
                                onChange={e => setNewEvent({ ...newEvent, endDate: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div className="md:col-span-2 flex items-end">
                            <button className="w-full py-3 bg-primary-600 text-white font-black rounded-xl shadow-lg shadow-primary-200 hover:scale-105 transition-all">
                                Release to Calendar
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="py-4 text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {renderCalendar()}
                </div>
            </div>

            {/* Upcoming List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center">
                        <Tag className="h-5 w-5 mr-3 text-primary-500" />
                        Upcoming Academic Highlights
                    </h3>
                    <div className="space-y-4">
                        {events.slice(0, 4).map((event, i) => (
                            <div key={i} className="flex items-center p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-primary-100 transition-colors">
                                <div
                                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0"
                                    style={{ backgroundColor: event.color }}
                                >
                                    <CalendarIcon className="h-5 w-5" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h4 className="font-bold text-gray-900 leading-tight">{event.title}</h4>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
                                        {new Date(event.startDate).toLocaleDateString()} — {new Date(event.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-xs font-bold px-3 py-1 bg-white border border-gray-100 rounded-lg text-gray-400">
                                    {event.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-primary-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-100">
                    <div className="relative z-10">
                        <AlertCircle className="h-10 w-10 text-primary-400 mb-4" />
                        <h3 className="text-2xl font-black mb-2">Institutional Notice</h3>
                        <p className="text-primary-100 text-sm leading-relaxed opacity-80">
                            The academic calendar is subject to change based on governmental regulations and institutional decisions. Please check this section daily for dynamic updates regarding holidays and exam schedules.
                        </p>
                        <button className="mt-6 px-6 py-3 bg-white text-primary-900 font-black rounded-xl text-sm hover:scale-105 transition-all">
                            Export PDF Calendar
                        </button>
                    </div>
                    <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-white/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendar;
