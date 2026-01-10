import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Users, BookOpen, Calendar,
    ClipboardCheck, FileText, Settings, LogOut,
    GraduationCap, Building2, Ticket, Sparkles, MessageSquare, UserPlus, User
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';


const Sidebar = () => {
    const { user, logout } = useAuth();

    // Define navigation items based on role
    const getNavItems = (role) => {
        switch (role) {
            case 'Administrator':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
                    { icon: Users, label: 'Staff Management', path: '/admin/users' },
                    { icon: Building2, label: 'Departments', path: '/admin/departments' },
                    { icon: FileText, label: 'Subjects', path: '/admin/subjects' },
                    { icon: ClipboardCheck, label: 'Staff Attendance', path: '/admin/attendance' },
                    { icon: FileText, label: 'Exams', path: '/admin/exams' },
                    { icon: Ticket, label: 'Fees', path: '/admin/fees' },
                    { icon: Calendar, label: 'Academic Calendar', path: '/calendar' },
                    { icon: User, label: 'My Profile', path: '/profile' },
                    { icon: Sparkles, label: 'AI Doc Creator', path: '/tools/document-creator' },
                    { icon: MessageSquare, label: 'AI Assistant', path: '/tools/chatbot' },
                ];
            case 'Staff':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/staff/dashboard' },
                    { icon: UserPlus, label: 'Add Student', path: '/staff/add-student' },
                    { icon: Users, label: 'Student Directory', path: '/staff/students' },
                    { icon: Users, label: 'Faculty Directory', path: '/staff/faculty' },
                    { icon: BookOpen, label: 'My Subjects', path: '/staff/subjects' },
                    { icon: ClipboardCheck, label: 'Attendance', path: '/staff/attendance' },
                    { icon: FileText, label: 'Marks', path: '/staff/marks' },
                    { icon: Calendar, label: 'Manage Timetable', path: '/staff/timetable' },
                    { icon: Calendar, label: 'Academic Calendar', path: '/calendar' },
                    { icon: User, label: 'My Profile', path: '/profile' },
                    { icon: Sparkles, label: 'AI Doc Creator', path: '/tools/document-creator' },
                    { icon: MessageSquare, label: 'AI Assistant', path: '/tools/chatbot' },
                ];
            case 'Student':
                return [
                    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
                    { icon: ClipboardCheck, label: 'Attendance', path: '/student/attendance' },
                    { icon: FileText, label: 'My Results', path: '/student/marks' },
                    { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
                    { icon: Ticket, label: 'Fees', path: '/student/fees' },
                    { icon: Calendar, label: 'Academic Calendar', path: '/calendar' },
                    { icon: User, label: 'My Profile', path: '/profile' },
                    { icon: MessageSquare, label: 'AI Assistant', path: '/tools/chatbot' },
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems(user?.role);

    return (
        <div className="sidebar-container">
            {/* Logo Area */}
            <div className="sidebar-logo-area">
                <GraduationCap className="h-8 w-8 text-blue-500" />
                <span className="font-bold text-xl tracking-tight">SmartCollege</span>
            </div>

            {/* User Info - Mini Profile */}
            <div className="sidebar-user-area">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "sidebar-nav-link group",
                            isActive
                                ? "sidebar-nav-link-active"
                                : "sidebar-nav-link-inactive"
                        )}
                    >
                        <item.icon className="mr-3 h-5 w-5 opacity-75 group-hover:opacity-100" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
