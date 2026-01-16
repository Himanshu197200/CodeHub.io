import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const EventCard = ({ event }) => {
    const navigate = useNavigate();
    const daysLeft = Math.ceil((new Date(event.registrationDeadline) - new Date()) / (1000 * 60 * 60 * 24));

    return (
        <div
            onClick={() => navigate(`/events/${event.id}`)}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
        >

            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                <img
                    src={event.banner || event.thumbnail || import.meta.env.VITE_PLACEHOLDER_IMAGE_URL}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onLoad={(e) => e.target.previousSibling.style.display = 'none'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-[10px] font-bold px-2.5 py-1 rounded-full text-gray-800 shadow-sm tracking-wide uppercase">
                        {event.type}
                    </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs font-medium text-white/90 bg-black/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                        {event.category}
                    </span>
                </div>
            </div>


            <div className="p-5 flex flex-col flex-grow relative">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                        {event.title}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${event.isPaid ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {event.isPaid ? 'PAID' : 'FREE'}
                    </span>
                </div>

                <p className="text-sm text-gray-500 mb-4 font-medium truncate">
                    by {event.organizer?.name || 'College Club'}
                </p>

                <div className="space-y-2.5 mt-auto">
                    <div className="flex items-center text-gray-600 text-sm group/item">
                        <div className="p-1.5 rounded-full bg-gray-50 text-gray-400 group-hover/item:bg-primary-50 group-hover/item:text-primary-500 transition-colors mr-2.5">
                            <Calendar size={14} />
                        </div>
                        <span className="font-medium">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm group/item">
                        <div className="p-1.5 rounded-full bg-gray-50 text-gray-400 group-hover/item:bg-primary-50 group-hover/item:text-primary-500 transition-colors mr-2.5">
                            <MapPin size={14} />
                        </div>
                        <span className="truncate font-medium">{event.venue}</span>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-50 flex items-center justify-between">
                        {daysLeft > 0 ? (
                            <div className="flex items-center text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1 rounded-md">
                                <Clock size={12} className="mr-1.5" />
                                <span>{daysLeft} DAYS LEFT</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-md">
                                <Clock size={12} className="mr-1.5" />
                                <span>CLOSED</span>
                            </div>
                        )}

                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
