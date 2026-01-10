import { Bell, Search, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    return (
        <header className="navbar-container">
            {/* Left Side: Toggle & Search */}
            <div className="flex items-center space-x-4">
                <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600">
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
            <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-gray-50 rounded-full text-gray-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
