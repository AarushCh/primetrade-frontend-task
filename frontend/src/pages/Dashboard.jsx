import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
    FaPlus,
    FaCheck,
    FaTrash,
    FaSearch,
    FaUserShield,
    FaUser,
    FaEdit,
    FaSave,
    FaTimes,
    FaClipboardList
} from 'react-icons/fa';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const { user } = useContext(AuthContext);

    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await api.get(`/tasks?search=${search}`, {
                headers: { 'x-auth-token': token }
            });
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [search]);

    const addTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await api.post(
            '/tasks',
            { title, description: desc },
            { headers: { 'x-auth-token': token } }
        );
        setTitle('');
        setDesc('');
        fetchTasks();
    };

    const toggleStatus = async (id, currentStatus) => {
        const token = localStorage.getItem('token');
        await api.put(
            `/tasks/${id}`,
            { status: currentStatus === 'pending' ? 'completed' : 'pending' },
            { headers: { 'x-auth-token': token } }
        );
        fetchTasks();
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        const token = localStorage.getItem('token');
        await api.delete(`/tasks/${id}`, {
            headers: { 'x-auth-token': token }
        });
        fetchTasks();
    };

    const startEdit = (task) => {
        setEditingTask(task._id);
        setEditTitle(task.title);
        setEditDesc(task.description);
    };

    const saveEdit = async (id) => {
        const originalTask = tasks.find((t) => t._id === id);
        if (
            originalTask.title === editTitle &&
            (originalTask.description || '') === editDesc
        ) {
            setEditingTask(null);
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await api.put(
                `/tasks/${id}`,
                { title: editTitle, description: editDesc },
                { headers: { 'x-auth-token': token } }
            );
            setEditingTask(null);
            fetchTasks();
            alert('Task updated! Status has been reset to Pending for Admin approval.');
        } catch (err) {
            alert('Failed to update task.');
        }
    };

    const isOwner = (task) => {
        const userId = user._id || user.id;
        return userId === task.user?._id;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            <Navbar />

            <div className="max-w-6xl mx-auto p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">
                            Team Board
                        </h1>
                        <p className="text-slate-300 mt-2 flex items-center gap-2">
                            Logged in as:
                            <span className="font-semibold text-indigo-400 text-lg">
                                {user?.username}
                            </span>

                            {user?.role === 'admin' ? (
                                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold border border-red-400/30">
                                    <FaUserShield /> ADMIN
                                </span>
                            ) : (
                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-bold border border-blue-400/30">
                                    <FaUser /> MEMBER
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <FaSearch className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Add Task */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-8 border border-white/20">
                    <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                            required
                        />
                        <input
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Details (Optional)"
                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 justify-center"
                        >
                            <FaPlus /> Add Task
                        </button>
                    </form>
                </div>

                {/* Empty State */}
                {tasks.length === 0 && (
                    <div className="text-center py-20 opacity-60">
                        <FaClipboardList className="mx-auto text-6xl text-slate-500 mb-4" />
                        <p className="text-xl text-slate-400 font-medium">
                            No tasks found. Start by adding one!
                        </p>
                    </div>
                )}

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`flex flex-col relative bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20 border-l-8 transition-all ${task.status === 'completed'
                                ? 'border-green-400'
                                : 'border-yellow-400'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                                    <FaUser /> {task.user?.username || 'Unknown'}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${task.status === 'completed'
                                        ? 'bg-green-500/20 text-green-400 border-green-400/30'
                                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
                                        }`}
                                >
                                    {task.status}
                                </span>
                            </div>

                            {editingTask === task._id ? (
                                <div className="mb-4 space-y-3 bg-white/10 p-4 rounded-xl border border-white/20">
                                    <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    />
                                    <textarea
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        rows="3"
                                        className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => saveEdit(task._id)}
                                            className="flex-1 bg-green-500/20 text-green-400 border border-green-400/30 py-2 rounded-lg font-bold flex items-center justify-center gap-1"
                                        >
                                            <FaSave /> Save
                                        </button>
                                        <button
                                            onClick={() => setEditingTask(null)}
                                            className="flex-1 bg-white/10 text-slate-300 border border-white/20 py-2 rounded-lg font-bold flex items-center justify-center gap-1"
                                        >
                                            <FaTimes /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-grow">
                                    <h3
                                        className={`text-xl font-bold mb-2 ${task.status === 'completed'
                                            ? 'text-green-400'
                                            : 'text-white'
                                            }`}
                                    >
                                        {task.title}
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-6">
                                        {task.description}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-2 border-t border-white/10 pt-4 mt-auto">
                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => toggleStatus(task._id, task.status)}
                                        className="flex-1 bg-green-500/20 text-green-400 border border-green-400/30 py-2 rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        <FaCheck />
                                        {task.status === 'pending' ? 'Approve' : 'Reopen'}
                                    </button>
                                )}

                                {(user.role === 'admin' || isOwner(task)) && (
                                    <>
                                        {!editingTask && isOwner(task) && (
                                            <button
                                                onClick={() => startEdit(task)}
                                                className="p-2 bg-white/10 border border-white/20 text-indigo-400 rounded-lg"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            className="p-2 bg-white/10 border border-white/20 text-red-400 rounded-lg"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;