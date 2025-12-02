import { useState, useEffect } from 'react';
import { Plus, Users, Hash, Copy, Check } from 'lucide-react';
import api from '../services/api';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [events, setEvents] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [openJoin, setOpenJoin] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', eventId: '' });
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState('');

    useEffect(() => {
        fetchTeams();
        fetchTeamEvents();
    }, []);

    const fetchTeams = async () => {
        try {
            const { data } = await api.get('/teams/my-teams');
            setTeams(data);
        } catch (error) {
            console.error('Failed to fetch teams');
        }
    };

    const fetchTeamEvents = async () => {
        try {
            const { data } = await api.get('/events?type=TEAM');
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events');
        }
    };

    const handleCreateTeam = async () => {
        try {
            await api.post('/teams', newTeam);
            setOpenCreate(false);
            fetchTeams();
            setNewTeam({ name: '', eventId: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create team');
        }
    };

    const handleJoinTeam = async () => {
        try {
            await api.post('/teams/join', { code: joinCode });
            setOpenJoin(false);
            fetchTeams();
            setJoinCode('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join team');
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
                        <p className="text-gray-500 mt-1">Manage your squads for upcoming team events.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setOpenJoin(true)}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm"
                        >
                            Join with Code
                        </button>
                        <button
                            onClick={() => setOpenCreate(true)}
                            className="px-4 py-2 bg-primary-600 text-gray-700 font-medium rounded-lg hover:bg-primary-700 transition shadow-sm flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create Team
                        </button>
                    </div>
                </div>

                {teams.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No teams yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new team or joining one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map((team) => (
                            <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                                            <p className="text-sm text-primary-600 font-medium">{team.event.title}</p>
                                        </div>
                                        <div className="bg-primary-50 p-2 rounded-lg">
                                            <Users size={20} className="text-primary-600" />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 mb-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Team Code</p>
                                            <p className="font-mono font-bold text-gray-900">{team.code}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(team.code)}
                                            className="text-gray-400 hover:text-primary-600 transition"
                                            title="Copy Code"
                                        >
                                            {copied === team.code ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-2">Members</p>
                                        <ul className="space-y-2">
                                            {team.members.map((member) => (
                                                <li key={member.id} className="flex items-center gap-2 text-sm text-gray-700">
                                                    <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                        {member.user.name.charAt(0)}
                                                    </div>
                                                    <span>{member.user.name}</span>
                                                    {member.status === 'ACCEPTED' && <Check size={14} className="text-green-500 ml-auto" />}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Team Modal */}
            {openCreate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Team</h2>
                        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={newTeam.name}
                                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                                    placeholder="e.g. Code Warriors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Event</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={newTeam.eventId}
                                    onChange={(e) => setNewTeam({ ...newTeam, eventId: e.target.value })}
                                >
                                    <option value="">Choose an event...</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>{event.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setOpenCreate(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTeam}
                                className="px-4 py-2 bg-primary-600 text-gray-700 rounded-lg hover:bg-primary-700 transition"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Team Modal */}
            {openJoin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Join a Team</h2>
                        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team Code</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500 uppercase font-mono"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    placeholder="e.g. A1B2C3"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Ask your team leader for the 6-character code.</p>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setOpenJoin(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleJoinTeam}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                            >
                                Join Team
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Teams;
