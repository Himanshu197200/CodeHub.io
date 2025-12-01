import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Star, TrendingUp, Award, Zap } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/dashboard');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 mt-2 text-lg">Welcome back, <span className="font-semibold text-gray-900">{user.name}</span>! Here's what's happening.</p>
                    </div>
                    <div className="hidden md:block">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <Zap size={14} className="mr-1" /> Live Updates
                        </span>
                    </div>
                </div>

                {['ORGANIZER', 'ADMIN'].includes(user.role) ? (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                                    <Calendar size={32} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Events</p>
                                    <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.totalEvents}</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="p-4 bg-green-50 rounded-2xl text-green-600">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Registrations</p>
                                    <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.totalRegistrations}</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
                                    <Star size={32} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Avg Rating</p>
                                    <p className="text-4xl font-extrabold text-gray-900 mt-1">{stats.avgRating}</p>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <TrendingUp className="text-gray-400" size={20} />
                                    Registrations Overview
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.events}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis
                                                dataKey="title"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f9fafb' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="registrations" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <Star className="text-gray-400" size={20} />
                                    Feedback Summary
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.events}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis
                                                dataKey="title"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f9fafb' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="feedbacks" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-5 bg-blue-100 rounded-full text-primary-600 mb-6 relative z-10">
                                <TrendingUp size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">Events Registered</h3>
                            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 mb-4 relative z-10">{stats.registrations}</p>
                            <p className="text-gray-500 font-medium relative z-10">Keep participating to boost your skills!</p>
                        </div>

                        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="p-5 bg-green-100 rounded-full text-green-600 mb-6 relative z-10">
                                <Award size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">Events Attended</h3>
                            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-4 relative z-10">{stats.attended}</p>
                            <p className="text-gray-500 font-medium relative z-10">Great job showing up!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
