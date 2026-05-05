import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { FolderKanban, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.accessToken, res.refreshToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-primary-500 selection:text-white">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/40 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6">
            <FolderKanban className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Sign up today
            </Link>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-white">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-4 flex items-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input
                {...register('email')}
                type="email"
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all sm:text-sm font-medium text-slate-900"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-2 text-sm text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all sm:text-sm font-medium text-slate-900"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-sm text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary-500/20 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign in'}
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-3">Demo Credentials</p>
              <div className="text-sm text-slate-600 flex flex-col gap-1">
                <span><span className="font-medium text-slate-800">Admin:</span> admin@example.com / Admin@1234</span>
                <span><span className="font-medium text-slate-800">Member:</span> alice@example.com / Member@1234</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
