import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
    Calendar, Users, Star, TrendingUp, Edit, Trash2, Plus,
    Eye, X, Loader, Search, MapPin, Clock
} from 'lucide-react';

const HostDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchHostData();
    }, [user, navigate]);

    const fetchHostData = async () => {
        try {
            setLoading(true);
            const eventsRes = await api.get('/events');
            const hostEvents = eventsRes.data.filter(event => event.organizerId === user.id);
            setMyEvents(hostEvents);

            const totalRegistrations = hostEvents.reduce((sum, event) => sum + (event._count?.registrations || 0), 0);
            const avgRating = hostEvents.length > 0
                ? (hostEvents.reduce((sum, event) => sum + (event.avgRating || 0), 0) / hostEvents.length).toFixed(1)
                : '0.0';

            setAnalytics({
                totalEvents: hostEvents.length,
                totalRegistrations,
                avgRating,
                upcomingEvents: hostEvents.filter(e => new Date(e.date) > new Date()).length,
                pastEvents: hostEvents.filter(e => new Date(e.date) <= new Date()).length,
            });
        } catch (error) {
            console.error('Failed to fetch host data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!eventToDelete) return;

        try {
            await api.delete(`/events/${eventToDelete}`);
            setMyEvents(myEvents.filter(event => event.id !== eventToDelete));
            setShowDeleteModal(false);
            setEventToDelete(null);
            fetchHostData();
        } catch (error) {
            console.error('Failed to delete event:', error);
            alert('Failed to delete event. Please try again.');
        }
    };

    const filteredEvents = myEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const eventDate = new Date(event.date);
        const now = new Date();
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'upcoming' && eventDate > now) ||
            (filterStatus === 'past' && eventDate <= now);

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">Host Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Manage your events and track performance
                    </p>
                </div>

                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Events</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalEvents}</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <Calendar className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalRegistrations}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <Users className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.avgRating}</p>
                                </div>
                                <div className="p-3 bg-yellow-50 rounded-lg">
                                    <Star className="w-8 h-8 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.upcomingEvents}</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <TrendingUp className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
                        <button
                            onClick={() => navigate('/create-event')}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Create Event
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">All Events</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </select>
                    </div>

                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-600 mb-6">
                                {myEvents.length === 0
                                    ? "Get started by creating your first event"
                                    : "Try adjusting your search or filter"}
                            </p>
                            {myEvents.length === 0 && (
                                <button
                                    onClick={() => navigate('/create-event')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Your First Event
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredEvents.map(event => {
                                const eventDate = new Date(event.date);
                                const isPast = eventDate < new Date();

                                return (
                                    <div
                                        key={event.id}
                                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-indigo-300"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        {new Date(event.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    {event.location && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            {event.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${isPast
                                                    ? 'bg-gray-100 text-gray-600'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {isPast ? 'Past' : 'Upcoming'}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                            {event.description || 'No description available'}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500">Registrations</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {event._count?.registrations || 0}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Rating</p>
                                                <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    {event.avgRating || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/events/${event.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </button>
                                            <button
                                                onClick={() => navigate(`/events/${event.id}/edit`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEventToDelete(event.id);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Delete Event</h3>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-gray-600 mb-8">
                                Are you sure you want to delete this event? This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteEvent}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default HostDashboard;
