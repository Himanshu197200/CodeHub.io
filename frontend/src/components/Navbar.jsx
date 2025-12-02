import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Bell, LogOut, LayoutDashboard, Users, PlusCircle, Calendar, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50' : 'bg-white border-b border-gray-100'
                }`}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col">
                    <div className="flex justify-between h-20 items-center border-b border-gray-100">

                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-105">
                                <img
                                    src="/nst-logo.png"
                                    alt="NST Events"
                                    className="w-full h-full object-contain drop-shadow-md"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">
                                NST Events
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            <Link
                                to="/"
                                className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-200 ${isActive('/')
                                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                                    : 'text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/events"
                                className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-200 ${isActive('/events')
                                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                                    : 'text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                Events
                            </Link>
                            {user && (
                                ['ORGANIZER', 'ADMIN'].includes(user.role) ? (
                                    <Link
                                        to="/host-dashboard"
                                        className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-200 ${isActive('/host-dashboard')
                                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                                            : 'text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        to="/teams"
                                        className={`px-6 py-3 rounded-full text-base font-bold transition-all duration-200 ${isActive('/teams')
                                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                                            : 'text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                    >
                                        My Teams
                                    </Link>
                                )
                            )}
                        </div>


                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="hidden md:flex items-center gap-4">
                                    {['ORGANIZER', 'ADMIN'].includes(user.role) && (
                                        <Link
                                            to="/create-event"
                                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 hover:shadow-gray-900/40 transform hover:-translate-y-0.5"
                                        >
                                            <PlusCircle size={16} />
                                            <span>Create Event</span>
                                        </Link>
                                    )}

                                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors relative">
                                        <Bell className="h-5 w-5" />
                                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                                        >
                                            <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                                {user.name.split(' ')[0]}
                                            </span>
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <ChevronDown size={14} className="text-gray-400 mr-1" />
                                        </button>

                                        {isProfileOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setIsProfileOpen(false)}
                                                ></div>
                                                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transform origin-top-right transition-all">
                                                    <div className="px-4 py-3 border-b border-gray-50">
                                                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                    <div className="p-1">
                                                        {['ORGANIZER', 'ADMIN'].includes(user.role) ? (
                                                            <Link
                                                                to="/host-dashboard"
                                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                                                onClick={() => setIsProfileOpen(false)}
                                                            >
                                                                <LayoutDashboard size={16} className="text-gray-400" />
                                                                Dashboard
                                                            </Link>
                                                        ) : (
                                                            <>
                                                                <Link
                                                                    to="/dashboard"
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                                                    onClick={() => setIsProfileOpen(false)}
                                                                >
                                                                    <LayoutDashboard size={16} className="text-gray-400" />
                                                                    Dashboard
                                                                </Link>
                                                                <Link
                                                                    to="/teams"
                                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                                                    onClick={() => setIsProfileOpen(false)}
                                                                >
                                                                    <Users size={16} className="text-gray-400" />
                                                                    My Teams
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="border-t border-gray-50 p-1">
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                        >
                                                            <LogOut size={16} />
                                                            Sign out
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center justify-end flex-1 gap-4">
                                    <Link
                                        to="/organizer-login"
                                        className="px-6 py-3 rounded-full text-base font-bold text-teal-600 border-2 border-teal-600 hover:bg-teal-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                    >
                                        Host Event
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-full text-base font-bold transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 transform hover:-translate-y-0.5"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            )}


                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>


                    {location.pathname === '/events' && (
                        <div className="hidden md:flex items-center justify-center py-3 gap-4 bg-white/50 backdrop-blur-sm">
                            {['ALL', 'TECHNICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP'].map((cat) => (
                                <Link
                                    key={cat}
                                    to={`/events?category=${cat}`}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${location.search.includes(`category=${cat}`) || (cat === 'ALL' && !location.search.includes('category'))
                                        ? 'bg-teal-100 text-teal-800 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {
                isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link
                                to="/"
                                className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/events"
                                className={`block px-4 py-3 rounded-xl text-base font-medium ${isActive('/events') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Events
                            </Link>
                            {user ? (
                                <>
                                    {['ORGANIZER', 'ADMIN'].includes(user.role) ? (
                                        <Link
                                            to="/host-dashboard"
                                            className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/teams"
                                                className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                My Teams
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col gap-3">
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block w-full text-center px-4 py-3 rounded-xl bg-primary-600 text-white font-medium"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
