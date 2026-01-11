import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, X, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../../api/axios';

const Navbar = ({ toggleSidebar }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every minute for new notifications
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
            // Mark visible ones as read when opening? Or maybe manual interaction is better.
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
            case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const clearNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error("Error deleting notification");
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all read");
        }
    };

    return (
        <header className="navbar-container relative z-50">
            {/* Left Side: Toggle & Search */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-xl text-gray-700 transition-colors shadow-sm bg-white lg:shadow-none"
                    aria-label="Toggle Navigation"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64 transition-all"
                    />
                </div>
            </div>

            {/* Right Side: Notifications */}
            <div className="flex items-center space-x-4" ref={notificationRef}>
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-2 rounded-full transition-all ${showNotifications ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                </button>

                {/* Notification Panel */}
                <AnimatePresence>
                    {showNotifications && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-16 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-black ring-opacity-5"
                        >
                            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-bold text-gray-800">Notifications</h3>
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{unreadCount} New</span>
                                    <button onClick={markAllRead} className="text-xs text-gray-500 hover:text-red-500 font-medium">Mark Read</button>
                                </div>
                            </div>

                            <div className="max-h-[70vh] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {notifications.map((item) => (
                                            <div key={item._id} className={`p-4 hover:bg-gray-50 transition-colors group relative ${!item.isRead ? 'bg-blue-50/30' : ''}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 p-2 rounded-full bg-opacity-10 ${item.type === 'alert' ? 'bg-red-50' : item.type === 'success' ? 'bg-green-50' : 'bg-blue-50'}`}>
                                                        {getIcon(item.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-gray-800 truncate">{item.title}</h4>
                                                        <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.message}</p>
                                                        <span className="text-xs text-gray-400 mt-2 block font-medium">
                                                            {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            clearNotification(item._id);
                                                        }}
                                                        className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No new notifications</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                                <button className="text-xs font-bold text-primary-600 hover:text-primary-700">View All Activity</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
};

export default Navbar;
