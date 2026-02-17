import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, MapPin, Building, User, Phone, Mail, ArrowRight, Loader, Plus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SignInButton } from '@clerk/clerk-react';
import api from '../services/api';

const RegistrationForm = ({ event, onClose, onSubmit, initialData = {} }) => {
    const { user, login } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: user?.email || '',
        mobile: '',
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        gender: '',
        organization: '',
        type: 'College Student',
        differentlyAbled: 'No',
        location: '',
        ...initialData,
        terms: false
    });

    // Team Registration State
    const [isTeamRegistration, setIsTeamRegistration] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState([]);

    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (step === 3) {
            const timer = setTimeout(() => {
                onSubmit(formData);
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step, onClose, onSubmit, formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Team Member Handlers
    const addMember = () => {
        setMembers([...members, { firstName: '', lastName: '', email: '', mobile: '', gender: 'Male', type: 'College Student', organization: formData.organization || '', location: formData.location || '' }]);
    };

    const removeMember = (index) => {
        const newMembers = [...members];
        newMembers.splice(index, 1);
        setMembers(newMembers);
    };

    const updateMember = (index, field, value) => {
        const newMembers = [...members];
        newMembers[index][field] = value;
        setMembers(newMembers);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.organization) newErrors.organization = 'Organization is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.terms) newErrors.terms = 'Please accept the Terms & Conditions';

        if (isTeamRegistration) {
            if (!teamName.trim()) newErrors.teamName = 'Team name is required';
            members.forEach((m, i) => {
                if (!m.firstName) newErrors[`member_${i}_firstName`] = 'Required';
                if (!m.email) newErrors[`member_${i}_email`] = 'Required';
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        await handleSubmitRegistration();
    };

    const handleSubmitRegistration = async () => {
        setSubmitting(true);
        try {
            if (isTeamRegistration) {
                await api.post(`/events/${event.id}/register-team`, {
                    ...formData,
                    teamName,
                    members
                });
            } else if (user && user.email === formData.email) {
                await api.post(`/events/${event.id}/register`, formData);
            } else {
                const response = await api.post(`/events/${event.id}/register-public`, {
                    ...formData
                });
            }

            setStep(3);
        } catch (error) {
            setErrors(prev => ({ ...prev, submit: error.response?.data?.message || 'Registration failed' }));
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        handleSubmitRegistration();
    };

    if (step === 3) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-in fade-in zoom-in duration-200 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                    <p className="text-gray-500">You have successfully registered for {event.title}.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]">

                <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl z-10">
                    <div className="text-center w-full">
                        <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-bold">N</span>
                        </div>
                        <p className="text-teal-500 font-bold text-xs tracking-widest uppercase mb-1">NST EVENTS</p>
                        <p className="text-teal-500 font-bold text-xs tracking-widest uppercase mb-1">NST EVENTS</p>
                        <h2 className="text-2xl font-bold text-gray-900">Event Registration</h2>
                        <p className="text-sm text-gray-500">Fill in your details to secure your spot</p>
                    </div>
                    <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>


                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleNext} className="space-y-6">

                        {event.type === 'TEAM' && (
                            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100 mb-6">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${isTeamRegistration ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-300'}`}>
                                        {isTeamRegistration && <CheckCircle size={16} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isTeamRegistration}
                                        onChange={(e) => setIsTeamRegistration(e.target.checked)}
                                        className="hidden"
                                    />
                                    <div>
                                        <span className="font-bold text-gray-900 block">Register as a Team</span>
                                        <span className="text-xs text-gray-500">Create a team and add members now</span>
                                    </div>
                                </label>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder="student@college.edu"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>


                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile <span className="text-red-500">*</span></label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">
                                        🇮🇳 +91
                                    </span>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                        placeholder="9876543210"
                                    />
                                </div>
                                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                            </div>


                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="John"
                                    disabled={isTeamRegistration && members.length > 0} // Optional: lock leader name if team logic is complex, but keeping editable is fine
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>


                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['Female', 'Male', 'Transgender', 'Others'].map((g) => (
                                    <label key={g} className={`
                                        cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all
                                        ${formData.gender === g
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                                    `}>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={formData.gender === g}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="text-sm font-medium">{g}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                        </div>


                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Organization / Institute Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="organization"
                                value={formData.organization}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                placeholder="Enter your college or company name"
                            />
                            {errors.organization && <p className="text-red-500 text-xs mt-1">{errors.organization}</p>}
                        </div>


                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Type <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['College Student', 'Professional', 'School Student', 'Fresher'].map((t) => (
                                    <label key={t} className={`
                                        cursor-pointer border rounded-xl p-3 flex items-center justify-center text-center transition-all
                                        ${formData.type === t
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600 text-sm'}
                                    `}>
                                        <input
                                            type="radio"
                                            name="type"
                                            value={t}
                                            checked={formData.type === t}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        {t}
                                    </label>
                                ))}
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Differently Abled</label>
                            <div className="flex gap-4">
                                {['No', 'Yes'].map((opt) => (
                                    <label key={opt} className={`
                                        cursor-pointer px-6 py-2 rounded-lg border transition-all
                                        ${formData.differentlyAbled === opt
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'}
                                    `}>
                                        <input
                                            type="radio"
                                            name="differentlyAbled"
                                            value={opt}
                                            checked={formData.differentlyAbled === opt}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="City, Country"
                                />
                            </div>
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>

                        {/* Team Details Section */}
                        {isTeamRegistration && (
                            <div className="space-y-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="text-primary-600" size={24} />
                                    <h3 className="text-lg font-bold text-gray-900">Team Details</h3>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Team Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                        placeholder="Enter team name"
                                    />
                                    {errors.teamName && <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>}
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-sm font-bold text-gray-700">Team Members</label>
                                        <button
                                            type="button"
                                            onClick={addMember}
                                            className="flex items-center gap-1 text-sm text-primary-600 font-bold hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors"
                                        >
                                            <Plus size={16} />
                                            Add Member
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {members.map((member, index) => (
                                            <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(index)}
                                                    className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">{index + 1}</span>
                                                    Member Details
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="First Name"
                                                            value={member.firstName}
                                                            onChange={(e) => updateMember(index, 'firstName', e.target.value)}
                                                            className={`w-full px-3 py-2 rounded-lg border ${errors[`member_${index}_firstName`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} text-sm focus:border-primary-500 outline-none`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="Last Name"
                                                            value={member.lastName}
                                                            onChange={(e) => updateMember(index, 'lastName', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <input
                                                            type="email"
                                                            placeholder="Email Address"
                                                            value={member.email}
                                                            onChange={(e) => updateMember(index, 'email', e.target.value)}
                                                            className={`w-full px-3 py-2 rounded-lg border ${errors[`member_${index}_email`] ? 'border-red-300 bg-red-50' : 'border-gray-200'} text-sm focus:border-primary-500 outline-none`}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <input
                                                            type="tel"
                                                            placeholder="Mobile Number"
                                                            value={member.mobile}
                                                            onChange={(e) => updateMember(index, 'mobile', e.target.value)}
                                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {members.length === 0 && (
                                            <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                                No members added yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}


                        {errors.submit && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm">
                                <AlertCircle size={16} />
                                {errors.submit}
                            </div>
                        )}


                        <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
                            <div className="flex-1 flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                                    className={`mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 ${errors.terms ? 'border-red-500' : ''}`}
                                />
                                <label htmlFor="terms" className={`text-xs ${errors.terms ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                    By registering, you agree to share your data with the organizers and accept the <a href="#" className="text-primary-600 hover:underline font-bold">Terms & Conditions</a>.
                                </label>
                            </div>
                        </div>
                        {errors.terms && <p className="text-red-500 text-[10px] mt-1 ml-6">{errors.terms}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? 'Processing...' : (
                                <>
                                    {isTeamRegistration ? 'Register Team' : 'Register Now'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>

                        {user && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-lg font-bold text-primary-600 border border-gray-100">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Continue as {user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!user && (
                            <>
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-100"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500">Or sign in to continue</span>
                                    </div>
                                </div>

                                <SignInButton mode="modal">
                                    <button
                                        type="button"
                                        className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                                    >
                                        Sign In
                                    </button>
                                </SignInButton>
                            </>
                        )}

                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
