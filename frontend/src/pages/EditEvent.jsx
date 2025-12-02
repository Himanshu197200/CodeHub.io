import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { Upload, Calendar, Clock, MapPin, DollarSign, Users, Type, AlignLeft, AlertCircle, ArrowLeft, TrendingUp } from 'lucide-react';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [banner, setBanner] = useState(null);
    const [currentBanner, setCurrentBanner] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        type: 'SOLO',
        category: 'TECHNICAL',
        maxParticipants: '',
        isPaid: false,
        price: '',
        registrationDeadline: '',
        rules: '',
        faqs: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);

                // Format date for input
                const dateObj = new Date(data.date);
                const dateStr = dateObj.toISOString().split('T')[0];

                // Format deadline for input
                const deadlineObj = new Date(data.registrationDeadline);
                const deadlineStr = deadlineObj.toISOString().slice(0, 16);

                // Parse rules and faqs if they are arrays or objects
                let rulesStr = '';
                if (Array.isArray(data.rules)) {
                    rulesStr = data.rules.join('\n');
                } else if (typeof data.rules === 'string') {
                    rulesStr = data.rules;
                }

                let faqsStr = '';
                if (data.faqs && typeof data.faqs === 'object') {
                    faqsStr = data.faqs.answer || '';
                } else if (typeof data.faqs === 'string') {
                    faqsStr = data.faqs;
                }

                setFormData({
                    title: data.title,
                    description: data.description || '',
                    date: dateStr,
                    time: data.time,
                    venue: data.venue,
                    type: data.type,
                    category: data.category,
                    maxParticipants: data.maxParticipants,
                    isPaid: data.isPaid,
                    price: data.price || '',
                    registrationDeadline: deadlineStr,
                    rules: rulesStr,
                    faqs: faqsStr,
                    isHot: data.isHot || false
                });
                setCurrentBanner(data.banner);
            } catch (err) {
                console.error('Failed to fetch event:', err);
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setBanner(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (banner) {
            data.append('banner', banner);
        }

        try {
            await api.put(`/events/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/host-dashboard');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update event';
            setError(message);
            window.scrollTo(0, 0);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/host-dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900">Edit Event</h1>
                    <p className="mt-2 text-gray-600">Update your event details.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-center gap-3">
                        <AlertCircle className="text-red-500" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                    {/* Basic Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Type className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <AlignLeft className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    name="description"
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                >
                                    <option value="TECHNICAL">Technical</option>
                                    <option value="CULTURAL">Cultural</option>
                                    <option value="SPORTS">Sports</option>
                                    <option value="WORKSHOP">Workshop</option>
                                    <option value="SEMINAR">Seminar</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Participation Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                >
                                    <option value="SOLO">Solo</option>
                                    <option value="TEAM">Team</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Schedule & Venue */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Schedule & Venue</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="venue"
                                    required
                                    value={formData.venue}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="datetime-local"
                                    name="registrationDeadline"
                                    required
                                    value={formData.registrationDeadline}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Additional Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rules (One per line)</label>
                            <textarea
                                name="rules"
                                rows={4}
                                value={formData.rules}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">FAQs (One per line)</label>
                            <textarea
                                name="faqs"
                                rows={3}
                                value={formData.faqs}
                                onChange={handleChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Registration Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Registration Details</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    name="maxParticipants"
                                    required
                                    value={formData.maxParticipants}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                id="isPaid"
                                name="isPaid"
                                checked={formData.isPaid}
                                onChange={handleChange}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">This is a paid event</label>
                        </div>

                        {formData.isPaid && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                            <input
                                type="checkbox"
                                id="isHot"
                                name="isHot"
                                checked={formData.isHot}
                                onChange={handleChange}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isHot" className="text-sm font-bold text-red-600 flex items-center gap-2">
                                <TrendingUp size={16} />
                                Mark as Hot Event (Featured on Homepage)
                            </label>
                        </div>
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Event Banner</h2>

                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-teal-500 transition-colors bg-gray-50">
                            <div className="space-y-1 text-center">
                                {banner ? (
                                    <div className="space-y-4">
                                        <div className="relative w-64 h-40 mx-auto">
                                            <img
                                                src={URL.createObjectURL(banner)}
                                                alt="Banner preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                        <p className="text-sm font-medium text-teal-600">{banner.name}</p>
                                        <button
                                            type="button"
                                            onClick={() => setBanner(null)}
                                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {currentBanner && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-500 mb-2">Current Banner:</p>
                                                <div className="relative w-64 h-40 mx-auto">
                                                    <img
                                                        src={currentBanner}
                                                        alt="Current banner"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                                                <span>{currentBanner ? 'Change banner' : 'Upload a file'}</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex justify-center items-center gap-2 py-4 px-6 border-2 border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating Event...
                                </>
                            ) : (
                                <>
                                    <Calendar className="w-6 h-6" />
                                    Update Event
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;
