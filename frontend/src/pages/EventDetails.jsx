import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Calendar, MapPin, Clock, Users, Share2, AlertCircle, CheckCircle,
    ChevronLeft, Trophy, Star, MessageSquare, HelpCircle, Info,
    Award, ThumbsUp, MessageCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import FeedbackForm from '../components/FeedbackForm';
import RegistrationForm from '../components/RegistrationForm';
import { mockEventDetails } from '../data/mockEventDetails';
import { mockEvents } from '../data/mockEvents';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [activeTab, setActiveTab] = useState('details');


    const detailsRef = useRef(null);
    const datesRef = useRef(null);
    const prizesRef = useRef(null);
    const reviewsRef = useRef(null);
    const faqsRef = useRef(null);

    const tabs = [
        { id: 'details', label: 'Details', ref: detailsRef, icon: Info },
        { id: 'dates', label: 'Dates & Deadlines', ref: datesRef, icon: Calendar },
        { id: 'prizes', label: 'Prizes', ref: prizesRef, icon: Trophy },
        { id: 'reviews', label: 'Reviews', ref: reviewsRef, icon: Star },
        { id: 'faqs', label: 'FAQs & Discussions', ref: faqsRef, icon: HelpCircle },
    ];

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                let eventData = null;


                try {
                    const { data } = await api.get(`/events/${id}`);
                    eventData = data;
                } catch (err) {
                    console.log('API fetch failed, using mock data fallback');
                }


                if (!eventData) {
                    eventData = mockEvents.find(e => e.id === parseInt(id));
                }

                if (eventData) {
                    setEvent(eventData);

                    setEventDetails(mockEventDetails[id] || {});

                    if (user && eventData.registrations) {
                        const registered = eventData.registrations.some(reg => reg.userId === user.id);
                        setIsRegistered(registered);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch event', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, user]);

    const scrollToSection = (ref, tabId) => {
        setActiveTab(tabId);
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200;


            if (faqsRef.current && scrollPosition >= faqsRef.current.offsetTop) setActiveTab('faqs');
            else if (reviewsRef.current && scrollPosition >= reviewsRef.current.offsetTop) setActiveTab('reviews');
            else if (prizesRef.current && scrollPosition >= prizesRef.current.offsetTop) setActiveTab('prizes');
            else if (datesRef.current && scrollPosition >= datesRef.current.offsetTop) setActiveTab('dates');
            else if (detailsRef.current && scrollPosition >= detailsRef.current.offsetTop) setActiveTab('details');
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleRegisterClick = () => {
        setShowRegistrationForm(true);
    };

    const handleRegistrationSubmit = (formData) => {
        setIsRegistered(true);
        setShowRegistrationForm(false);
        setSuccess('Successfully registered!');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
            <button onClick={() => navigate('/')} className="text-primary-600 hover:underline">Go back home</button>
        </div>
    );

    const daysLeft = Math.ceil((new Date(event.registrationDeadline) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-gray-50 min-h-screen pb-20 pt-20">

            {showRegistrationForm && (
                <RegistrationForm
                    event={event}
                    onClose={() => setShowRegistrationForm(false)}
                    onSubmit={handleRegistrationSubmit}
                />
            )}


            <div className="relative bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ChevronLeft size={20} className="mr-1" /> Back to Events
                    </button>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3 lg:w-1/4">
                            <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={event.thumbnail || event.banner || import.meta.env.VITE_PLACEHOLDER_IMAGE_URL}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold border border-primary-100 uppercase tracking-wide">
                                    {event.type || 'EVENT'}
                                </span>
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                                    {event.category}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                                {event.title}
                            </h1>

                            <p className="text-lg text-gray-600 mb-6 line-clamp-2">
                                {event.description}
                            </p>

                            <div className="flex flex-wrap gap-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Calendar size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Clock size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Time</p>
                                        <p className="font-semibold text-gray-900">{event.time || 'TBA'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <MapPin size={20} className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Venue</p>
                                        <p className="font-semibold text-gray-900">{event.venue || 'TBA'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="border-t border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-30 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex overflow-x-auto no-scrollbar gap-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => scrollToSection(tab.ref, tab.id)}
                                    className={`
                                        flex items-center gap-2 py-4 border-b-2 text-sm font-bold whitespace-nowrap transition-colors
                                        ${activeTab === tab.id
                                            ? 'border-primary-600 text-primary-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="flex-1 space-y-8">


                        <section id="details" ref={detailsRef} className="scroll-mt-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Info className="text-primary-600" />
                                    About the Event
                                </h2>
                                <div className="prose prose-lg text-gray-600 max-w-none mb-8">
                                    {event.description}
                                </div>

                                {event.rules && event.rules.length > 0 && (
                                    <>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Rules & Guidelines</h3>
                                        <ul className="grid gap-3">
                                            {event.rules.map((rule, index) => (
                                                <li key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                    <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700 font-medium">{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </section>


                        <section id="dates" ref={datesRef} className="scroll-mt-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Calendar className="text-primary-600" />
                                    Important Dates
                                </h2>
                                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                                    {eventDetails?.keyDates && Object.entries(eventDetails.keyDates).map(([key, value], index) => {
                                        if (!value) return null;
                                        const label = key.replace(/([A-Z])/g, ' $1').trim();
                                        const date = new Date(value);
                                        const isPast = date < new Date();

                                        return (
                                            <div key={key} className="relative pl-8">
                                                <div className={`
                                                    absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
                                                    ${isPast ? 'bg-gray-200 border-gray-300' : 'bg-white border-primary-600'}
                                                `}></div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">
                                                        {label}
                                                    </p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>


                        <section id="prizes" ref={prizesRef} className="scroll-mt-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Trophy className="text-primary-600" />
                                    Rewards & Prizes
                                </h2>

                                {eventDetails?.prizes && eventDetails.prizes.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {eventDetails.prizes.map((prize, index) => (
                                            <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="text-4xl mb-4">{prize.icon}</div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">{prize.position}</h3>
                                                {prize.amount > 0 && (
                                                    <p className="text-2xl font-extrabold text-primary-600 mb-2">₹{prize.amount.toLocaleString()}</p>
                                                )}
                                                <p className="text-sm text-gray-600 font-medium">{prize.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Award size={48} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">Certificates for all participants</p>
                                    </div>
                                )}
                            </div>
                        </section>


                        <section id="reviews" ref={reviewsRef} className="scroll-mt-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Star className="text-primary-600" />
                                    Reviews & Feedback
                                </h2>

                                {eventDetails?.reviews && eventDetails.reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {eventDetails.reviews.map((review, index) => (
                                            <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                                                            {review.avatar}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{review.user}</p>
                                                            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                                                        <span className="font-bold text-yellow-700 text-sm">{review.rating}.0</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                    </div>
                                )}
                            </div>
                        </section>


                        <section id="faqs" ref={faqsRef} className="scroll-mt-24">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <HelpCircle className="text-primary-600" />
                                    FAQs & Discussions
                                </h2>

                                {eventDetails?.faqs && eventDetails.faqs.length > 0 ? (
                                    <div className="space-y-4">
                                        {eventDetails.faqs.map((faq, index) => (
                                            <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-primary-100 transition-colors">
                                                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                                                    <MessageCircle size={18} className="text-primary-500 mt-0.5 flex-shrink-0" />
                                                    {faq.question}
                                                </h3>
                                                <p className="text-gray-600 ml-6 pl-0.5">{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No FAQs available for this event.</p>
                                    </div>
                                )}
                            </div>
                        </section>

                    </div>


                    <div className="w-full lg:w-96">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">Registration Fee</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {event.isPaid ? `₹${event.price || event.registrationFee}` : 'Free'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 font-medium mb-1">Team Size</p>
                                        <div className="flex items-center gap-1 justify-end font-bold text-gray-900">
                                            <Users size={18} className="text-primary-600" />
                                            <span>1 - {event.maxParticipants || 1}</span>
                                        </div>
                                    </div>
                                </div>

                                {daysLeft > 0 ? (
                                    <div className="mb-6 bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center justify-center gap-2 text-orange-700 font-bold text-sm">
                                        <Clock size={16} />
                                        <span>Registration closes in {daysLeft} days</span>
                                    </div>
                                ) : (
                                    <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center justify-center gap-2 text-red-700 font-bold text-sm">
                                        <Clock size={16} />
                                        <span>Registration Closed</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-start gap-3">
                                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex items-start gap-3">
                                        <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                                        {success}
                                    </div>
                                )}

                                {isRegistered ? (
                                    <button
                                        disabled
                                        className="w-full py-4 px-6 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed shadow-md"
                                    >
                                        <CheckCircle size={20} />
                                        Registered
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRegisterClick}
                                        disabled={registering || daysLeft < 0}
                                        className="w-full py-4 px-6 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {registering ? 'Processing...' : daysLeft < 0 ? 'Registration Closed' : 'Register Now'}
                                    </button>
                                )}

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl shadow-inner">
                                            {event.organizer?.name?.charAt(0) || 'O'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{event.organizer?.name}</p>
                                            <p className="text-xs text-gray-500">Verified Organizer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Share this event</h3>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                                        LinkedIn
                                    </button>
                                    <button className="flex-1 py-2 bg-sky-50 text-sky-600 rounded-lg font-medium hover:bg-sky-100 transition-colors">
                                        Twitter
                                    </button>
                                    <button className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors">
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
