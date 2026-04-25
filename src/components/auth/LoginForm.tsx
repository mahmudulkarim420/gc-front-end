'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { AuthResponse } from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister 
        ? formData 
        : { email: formData.email, password: formData.password };

      const { data } = await api.post<AuthResponse>(endpoint, payload);

      // Save user info to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to chat
      router.push('/chat');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Authentication failed. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="glass-panel rounded-xl p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/40"></div>
      
      <div className="mb-6 flex justify-center gap-4 border-b border-outline-variant/20 pb-4">
        <button 
          onClick={() => setIsRegister(false)}
          className={`font-label-caps text-label-caps uppercase px-4 py-2 transition-all ${!isRegister ? 'text-primary border-b-2 border-primary' : 'text-outline-variant hover:text-on-surface'}`}
        >
          Login
        </button>
        <button 
          onClick={() => setIsRegister(true)}
          className={`font-label-caps text-label-caps uppercase px-4 py-2 transition-all ${isRegister ? 'text-primary border-b-2 border-primary' : 'text-outline-variant hover:text-on-surface'}`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {isRegister && (
          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-primary uppercase block px-1" htmlFor="username">
              Username
            </label>
            <div className="relative group inner-glow rounded-lg transition-all duration-300">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">person</span>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3.5 pl-12 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-outline-variant/50 transition-all" 
                id="username" 
                name="username" 
                placeholder="Choose a username" 
                type="text" 
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="font-label-caps text-label-caps text-primary uppercase block px-1" htmlFor="email">
            Email Address
          </label>
          <div className="relative group inner-glow rounded-lg transition-all duration-300">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">mail</span>
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3.5 pl-12 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-outline-variant/50 transition-all" 
              id="email" 
              name="email" 
              placeholder="name@company.com" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end px-1">
            <label className="font-label-caps text-label-caps text-primary uppercase block" htmlFor="password">
              Password
            </label>
            {!isRegister && <a className="text-[11px] font-semibold text-secondary hover:text-primary transition-colors" href="#">Forgot?</a>}
          </div>
          <div className="relative group inner-glow rounded-lg transition-all duration-300">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">lock</span>
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3.5 pl-12 pr-4 font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary/50 placeholder:text-outline-variant/50 transition-all" 
              id="password" 
              name="password" 
              placeholder="••••••••" 
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-headline-md text-headline-md py-4 rounded-lg shadow-lg shadow-secondary-container/20 transition-all active:scale-[0.98] mt-2 group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Login')}
          {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="h-px flex-1 bg-outline-variant/20"></div>
        <span className="font-label-caps text-label-caps text-outline-variant">Authorized Access Only</span>
        <div className="h-px flex-1 bg-outline-variant/20"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant/30 rounded-lg hover:bg-white/5 transition-colors font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[18px]">vpn_key</span>
          SSO
        </button>
        <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant/30 rounded-lg hover:bg-white/5 transition-colors font-body-sm text-body-sm">
          <span className="material-symbols-outlined text-[18px]">passkey</span>
          Passkey
        </button>
      </div>
    </section>
  );
}

