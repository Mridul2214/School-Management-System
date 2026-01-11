import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Clock,
    Tag,
    AlertCircle,
    Loader2,
    MapPin,
    ExternalLink,
    Filter,
    Download,
    Sparkles
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
    const [hoveredEvent, setHoveredEvent] = useState(null);

    // Form State for Admin
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'Event',
        category: 'Institutional',
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
                category: 'Institutional',
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
        const todayStr = new Date().toISOString().split('T')[0];

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/40 border-[0.5px] border-slate-100"></div>);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = new Date(year, month, day).toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            const dayEvents = events.filter(e => {
                const start = e.startDate.split('T')[0];
                const end = e.endDate.split('T')[0];
                return dateStr >= start && dateStr <= end;
            });

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.5)' }}
                    className="h-32 border-[0.5px] border-slate-100 p-2 relative group transition-all"
                >
                    <span className={clsx(
                        "text-[10px] font-black w-7 h-7 flex items-center justify-center rounded-xl mb-1.5 transition-all",
                        isToday ? "bg-primary-600 text-white shadow-lg shadow-primary-200" : "text-slate-400 group-hover:text-slate-600"
                    )}>
                        {day}
                    </span>
                    <div className="space-y-1.5 overflow-y-auto max-h-20 no-scrollbar pr-1">
                        {dayEvents.map((event, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                onMouseEnter={() => setHoveredEvent(event)}
                                onMouseLeave={() => setHoveredEvent(null)}
                                className="px-2 py-1 rounded-lg text-[9px] font-black text-white truncate shadow-sm cursor-pointer hover:brightness-110 active:scale-95 transition-all flex items-center"
                                style={{ backgroundColor: event.color || '#3b82f6' }}
                            >
                                <div className="w-1.5 h-1.5 bg-white/30 rounded-full mr-1.5 shrink-0" />
                                {event.title}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary-100 border-t-transparent animate-pulse" />
            </div>
            <p className="mt-6 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Syncing Calendar Data</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-12">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center space-x-2 text-primary-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                        <Sparkles className="h-3 w-3" />
                        <span>Schedule Management</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
                        Academic Portal
                        <CalendarIcon className="ml-4 h-8 w-8 text-slate-200" />
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-lg">
                        Stay ahead of institutional milestones, holiday breaks, and critical academic delivery windows.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-white p-1.5 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 ring-1 ring-slate-400/5">
                        <button onClick={prevMonth} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 transition-all active:scale-90"><ChevronLeft className="h-5 w-5" /></button>
                        <span className="px-6 text-sm font-black text-slate-800 min-w-[160px] text-center tracking-tight">
                            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={nextMonth} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 transition-all active:scale-90"><ChevronRight className="h-5 w-5" /></button>
                    </div>

                    {user?.role === 'Administrator' && (
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className={clsx(
                                "py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center shadow-lg active:scale-95",
                                isAdding ? "bg-slate-100 text-slate-600" : "bg-slate-900 text-white shadow-slate-300 shadow-2xl"
                            )}
                        >
                            {isAdding ? <ChevronLeft className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            {isAdding ? 'View Calendar' : 'Schedule Event'}
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.div
                        key="event-form"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100"
                    >
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center">
                            <Plus className="h-6 w-6 mr-3 text-primary-500" />
                            Create Global Academic Entry
                        </h3>
                        <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Title</label>
                                <input
                                    required
                                    value={newEvent.title}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold placeholder:text-slate-300"
                                    placeholder="e.g. Annual Symposium 2026"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Type</label>
                                <select
                                    value={newEvent.type}
                                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 transition-all font-bold appearance-none"
                                >
                                    <option>Event</option>
                                    <option>Holiday</option>
                                    <option>Exam</option>
                                    <option>Academic</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Theme</label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={newEvent.color}
                                        onChange={e => setNewEvent({ ...newEvent, color: e.target.value })}
                                        className="h-[52px] w-20 shrink-0 p-1 bg-white border border-slate-200 rounded-2xl cursor-pointer"
                                    />
                                    <div className="flex-1 flex items-center px-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-[10px] font-black">
                                        BRANDING
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Launch Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newEvent.startDate}
                                    onChange={e => setNewEvent({ ...newEvent, startDate: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conclusion Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newEvent.endDate}
                                    onChange={e => setNewEvent({ ...newEvent, endDate: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold"
                                />
                            </div>
                            <div className="md:col-span-2 flex items-end">
                                <button className="w-full py-5 bg-primary-600 text-white font-black rounded-2xl shadow-2xl shadow-primary-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3">
                                    <ExternalLink className="h-5 w-5" />
                                    <span>Broadcast Entry to Institution</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="calendar-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
                    >
                        <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="py-5 text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 relative">
                            {renderCalendar()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Section: Highlights & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                            <Tag className="h-6 w-6 mr-3 text-primary-500" />
                            Upcoming Milestones
                        </h3>
                        <button className="text-[10px] font-black uppercase text-primary-600 tracking-widest flex items-center hover:translate-x-1 transition-transform">
                            View All <ChevronRight className="ml-1 h-3 w-3" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.slice(0, 4).map((event, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="flex items-center p-5 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all"
                            >
                                <div
                                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
                                    style={{ backgroundColor: event.color }}
                                >
                                    <CalendarIcon className="h-6 w-6" />
                                </div>
                                <div className="ml-5 flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 leading-tight truncate">{event.title}</h4>
                                    <div className="flex items-center mt-1.5 text-[10px] text-slate-400 font-black tracking-widest uppercase">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                <div className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 tracking-tighter shadow-sm shrink-0">
                                    {event.type}
                                </div>
                            </motion.div>
                        ))}
                        {events.length === 0 && (
                            <div className="col-span-2 py-12 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-100 rounded-3xl">
                                No upcoming milestones recorded.
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20 group">
                    <div className="relative z-10">
                        <AlertCircle className="h-12 w-12 text-indigo-400 mb-6 group-hover:rotate-12 transition-transform duration-500" />
                        <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight">Institutional <br />Decision Notice</h3>
                        <p className="text-indigo-200/80 text-sm leading-relaxed font-medium">
                            The academic calendar is a living document. Any modifications due to governmental shifts or local administrative changes will be broadcasted here instantly.
                        </p>
                        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                            <button className="w-full py-4 bg-white text-indigo-950 font-black rounded-2xl text-xs hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center shadow-xl shadow-black/20">
                                <Download className="h-4 w-4 mr-2" />
                                Download 2026 Prospectus
                            </button>
                            <button className="w-full py-4 bg-white/5 text-white font-black rounded-2xl text-xs hover:bg-white/10 transition-all border border-white/10">
                                Sync with Google Calendar
                            </button>
                        </div>
                    </div>
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendar;
