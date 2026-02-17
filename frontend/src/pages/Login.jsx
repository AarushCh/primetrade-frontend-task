import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { login } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        try {
            await login(data.identifier, data.password);
        } catch (err) {
            setError('Invalid Username/Email or Password');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">

                <h2 className="text-3xl font-extrabold mb-2 text-center text-white">
                    Welcome Back 👋
                </h2>
                <p className="text-center text-slate-300 mb-6 text-sm">
                    Login to continue to your dashboard
                </p>

                {error && (
                    <div className="bg-red-500/20 border border-red-400/30 text-red-300 p-3 mb-4 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Username or Email
                        </label>
                        <input
                            {...register('identifier')}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                            placeholder="Enter username or email"
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Password
                        </label>
                        <input
                            {...register('password')}
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-slate-400 border border-white/20 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-slate-400 hover:text-indigo-400"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
                    >
                        Sign In 🚀
                    </button>

                </form>

                <p className="mt-6 text-center text-slate-300 text-sm">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-indigo-400 font-bold hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;