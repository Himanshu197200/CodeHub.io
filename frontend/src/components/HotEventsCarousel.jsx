import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HotEventsCarousel = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1 === events.length ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    if (!events || events.length === 0) return null;

    return (
        <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow-2xl group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{ backgroundImage: `url(${events[currentIndex].thumbnail || events[currentIndex].banner || '/event-image.jpeg'})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-primary-600 rounded-full">
                                {events[currentIndex].category}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                {events[currentIndex].title}
                            </h2>
                            <p className="text-gray-200 mb-6 line-clamp-2 max-w-2xl text-lg">
                                {events[currentIndex].description}
                            </p>

                            <div className="flex flex-wrap gap-6 mb-8 text-sm md:text-base font-medium text-gray-300">
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-primary-400" size={20} />
                                    <span>{new Date(events[currentIndex].date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="text-primary-400" size={20} />
                                    <span>{events[currentIndex].time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-primary-400" size={20} />
                                    <span>{events[currentIndex].venue}</span>
                                </div>
                            </div>

                            <Link
                                to={`/events/${events[currentIndex].id}`}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-primary-50 transition-colors transform hover:-translate-y-1"
                            >
                                Register Now
                                <ChevronRight size={20} />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                onClick={prevSlide}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                onClick={nextSlide}
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots Indicators */}
            <div className="absolute bottom-6 right-8 flex gap-2">
                {events.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HotEventsCarousel;
