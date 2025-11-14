
import React, { useState } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TiktokIcon } from './icons/TiktokIcon';
import { EyeOpenIcon } from './icons/EyeOpenIcon';
import { EyeClosedIcon } from './icons/EyeClosedIcon';
import { SocialButton } from './SocialButton';

const AuthFormV1: React.FC = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative z-10 w-full max-w-md mx-auto bg-gray-800/20 backdrop-blur-lg border border-gray-500/30 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          {isRegister ? 'Create an account' : 'Welcome back'}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          {isRegister ? 'Start your journey with us.' : 'Sign in to continue.'}
        </p>

        <div className="space-y-4">
          <SocialButton provider="Google" icon={<GoogleIcon />} />
          <SocialButton provider="Facebook" icon={<FacebookIcon />} />
          <SocialButton provider="TikTok" icon={<TiktokIcon />} />
        </div>

        <div className="flex items-center my-8">
          <hr className="flex-grow border-gray-600" />
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <form className="space-y-6">
          {isRegister && (
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-300 sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Username"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-300 sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" aria-label="Password" className="text-sm font-medium text-gray-300 sr-only">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
              placeholder="Password"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          
          {!isRegister && (
             <div className="flex items-center justify-end">
                <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300">
                    Forgot password?
                </a>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-transform"
            >
              {isRegister ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="font-medium text-cyan-400 hover:text-cyan-300">
            {isRegister ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthFormV1;
