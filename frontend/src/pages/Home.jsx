import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import HotEventsCarousel from '../components/HotEventsCarousel';
import { Search, Sparkles, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { mockEvents } from '../data/mockEvents';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');

                if (data && data.length > 0) {
                    setEvents(data);
                } else {
                    setEvents(mockEvents);
                }
            } catch (error) {
                console.error('Failed to fetch events, using mock data', error);
                setEvents(mockEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);


    // Base filter for all future events
    const allUpcoming = events
        .filter(event => {
            const eventDate = new Date(event.date);
            const now = new Date();
            const isFuture = eventDate >= now;
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.organizer?.name.toLowerCase().includes(searchQuery.toLowerCase());
            return isFuture && matchesSearch;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Hot events (explicitly marked)
    const hotEvents = allUpcoming.filter(event => event.isHot === true);

    // Carousel events: STRICTLY show only hot events
    const carouselEvents = hotEvents;

    // Grid events: Show 3 random upcoming events
    const gridEvents = [...allUpcoming].sort(() => 0.5 - Math.random()).slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50/50">

            <div className="relative bg-white overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-8 border border-primary-100 shadow-sm">
                        <Sparkles size={16} />
                        <span>The Ultimate Campus Event Platform</span>
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                        Discover. Compete. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                            Achieve Greatness.
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
                        Join the most exciting hackathons, workshops, and cultural fests happening in your college. Your journey to excellence starts here.
                    </p>


                    <div className="max-w-2xl mx-auto relative group mb-20">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-white rounded-xl shadow-xl p-2">
                            <Search className="ml-4 text-gray-400 h-6 w-6" />
                            <input
                                type="text"
                                placeholder="Search for events, clubs, or competitions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-lg bg-transparent"
                            />
                            <button className="hidden sm:block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Hot Events Carousel */}
                    {!loading && carouselEvents.length > 0 && (
                        <div className="max-w-6xl mx-auto mt-12">
                            <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                                <TrendingUp className="text-red-500" />
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {hotEvents.length > 0 ? 'Hot Events' : 'Featured Events'}
                                </h2>
                            </div>
                            <HotEventsCarousel events={carouselEvents} />
                        </div>
                    )}
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Calendar className="text-primary-600" />
                            Upcoming Events
                        </h2>
                        <p className="text-gray-500 text-lg mt-1">Don't miss out on these upcoming opportunities</p>
                    </div>
                    <Link
                        to="/events"
                        className="hidden sm:inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        View All Events
                        <ArrowRight size={20} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading amazing events...</p>
                    </div>
                ) : (
                    <>
                        {gridEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {gridEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No upcoming events found</h3>
                                <p className="text-gray-500">Try adjusting your search or check back later!</p>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-12 text-center sm:hidden">
                    <Link to="/events" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors">
                        View All Events
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;