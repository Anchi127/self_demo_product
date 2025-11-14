
import React, { useState } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { TiktokIcon } from './icons/TiktokIcon';
import { MobileIcon } from './icons/MobileIcon';
import { EmailIcon } from './icons/EmailIcon';
import { NavosLogo } from './icons/NavosLogo';
import { EyeOpenIcon } from './icons/EyeOpenIcon';
import { EyeClosedIcon } from './icons/EyeClosedIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';

type AuthStep = 'initial' | 'login' | 'register';

const AuthFormV2: React.FC = () => {
    const [step, setStep] = useState<AuthStep>('initial');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailMode, setIsEmailMode] = useState(true); // true = email mode, false = phone mode

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock check: 
        // - Email mode: if email is 'denglu@qq.com', go to login, else register.
        // - Phone mode: if phone is '1300000000', go to login, else register.
        if (isEmailMode) {
            // Email mode
            if (email.toLowerCase() === 'denglu@qq.com') {
                setStep('login');
            } else {
                setStep('register');
            }
        } else {
            // Phone mode
            if (email === '1300000000') {
                setStep('login');
            } else {
                setStep('register');
            }
        }
    };

    const handleGoBack = () => {
        setStep('initial');
    };

    const toggleInputMode = () => {
        setIsEmailMode(!isEmailMode);
        setEmail(''); // Clear input when switching modes
    };

    const renderInitialStep = () => (
        <>
            <div className="text-center">
                <NavosLogo className="mx-auto mb-8 h-8 w-auto"/>
                <h2 className="text-3xl font-bold text-white">Welcome to Navos</h2>
                <p className="mt-2 text-gray-400">Sign up to unlock all features</p>
            </div>

            <div className="mt-8 space-y-3">
                 <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors">
                    <GoogleIcon className="h-5 w-5 mr-3"/> Continue with Google
                </button>
                 <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors">
                    <TiktokIcon className="h-5 w-5 mr-3"/> Continue with TikTok
                </button>
                 <button className="w-full flex items-center justify-center py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors">
                    <FacebookIcon className="h-5 w-5 mr-3"/> Continue with Facebook
                </button>
                 <button 
                    type="button"
                    onClick={toggleInputMode}
                    className="w-full flex items-center justify-center py-3 px-4 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
                >
                    {isEmailMode ? (
                        <>
                            <MobileIcon className="h-5 w-5 mr-3"/> Continue with Mobile
                        </>
                    ) : (
                        <>
                            <EmailIcon className="h-5 w-5 mr-3"/> Continue with Email
                        </>
                    )}
                </button>
            </div>

            <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-600" />
                <span className="px-4 text-gray-500 text-xs">OR</span>
                <hr className="flex-grow border-gray-600" />
            </div>

            <form onSubmit={handleContinue}>
                <input
                    type={isEmailMode ? "email" : "tel"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEmailMode ? "Enter email" : "Enter Phone Number"}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
                <button
                    type="submit"
                    className="mt-4 w-full py-3 px-4 bg-cyan-500 text-black font-bold rounded-lg shadow-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-colors"
                >
                    Continue
                </button>
            </form>
            <p className="mt-6 text-xs text-center text-gray-500">
                By clicking Continue, you accept our <a href="#" className="text-gray-400 hover:underline">Terms of Service</a> and <a href="#" className="text-gray-400 hover:underline">Privacy Policy</a>
            </p>
        </>
    );

    const renderPasswordStep = (isLogin: boolean) => (
        <>
            <button onClick={handleGoBack} className="flex items-center space-x-2 text-gray-300 hover:text-white mb-8">
                <ChevronLeftIcon />
                <span>Go back</span>
            </button>
            <div className="text-center">
                 <h2 className="text-3xl font-bold text-white">{isLogin ? 'Enter your password' : 'Create an account'}</h2>
                 <p className="mt-2 text-gray-400 truncate">{email}</p>
            </div>

            <form className="mt-8 space-y-6">
                 <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        required
                        placeholder="Enter password"
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
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-cyan-500 text-black font-bold rounded-lg shadow-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-colors"
                >
                    {isLogin ? 'Sign in' : 'Sign up'}
                </button>
            </form>
            {isLogin && (
                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); alert('Redirect to sign in page');}} className="font-medium text-cyan-400 hover:text-cyan-300">Sign in</a>
                </p>
            )}
        </>
    );

    return (
        <div className="relative z-10 w-full max-w-sm mx-auto bg-gray-800/20 backdrop-blur-lg border border-gray-500/30 rounded-2xl shadow-2xl p-8 md:p-10">
            {step === 'initial' && renderInitialStep()}
            {step === 'login' && renderPasswordStep(true)}
            {step === 'register' && renderPasswordStep(false)}
        </div>
    );
};

export default AuthFormV2;
