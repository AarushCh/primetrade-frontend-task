import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="sticky top-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center text-white">

            {/* App Title */}
            <h1 className="text-lg font-extrabold tracking-wide">
                PrimeTrade.ai{" "}
                <span className="text-indigo-400">Frontend Task</span>
            </h1>

            {/* Right Section */}
            {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-slate-300 text-sm">
                        Welcome, <span className="font-semibold text-white">{user.username}</span>
                    </span>
                    <button
                        onClick={logout}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 px-4 py-1.5 rounded-lg font-bold transition-all"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 text-sm font-semibold">
                    <Link to="/login" className="hover:text-indigo-400 transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="hover:text-indigo-400 transition-colors">
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;