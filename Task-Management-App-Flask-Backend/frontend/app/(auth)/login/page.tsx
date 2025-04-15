"use client";

import Link from 'next/link';
import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const router = useRouter();
    const routerRef = useRef(router);

    const fetchWarmUp = async (): Promise<void> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
            if (!response.ok) {
                console.warn('Backend warm-up request failed:', response.status);
            }
        } catch (error) {
            console.error('Error warming up backend:', error);
        }
    };

    useEffect(() => {
        const authToken = localStorage.getItem('authtoken');
        if (authToken) {
            routerRef.current.push('/');
        }
        fetchWarmUp();
    }, []);

    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (email: string): boolean => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setErrorMessage('Invalid email address');
            return;
        }
        if (password.length < 5) {
            setErrorMessage('Password must be at least 5 characters long');
            return;
        }
        setErrorMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('authtoken', data.authtoken);
                console.log('Login successful!');
                routerRef.current.push('/');
            } else {
                setErrorMessage(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4" style={{ background: 'linear-gradient(to bottom, white, #AFA3FF)' }}>
            <div className="w-full max-w-lg lg:max-w-xl xl:max-w-[648px] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 bg-white border border-[#CECECE] rounded-2xl flex flex-col items-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl mb-6 text-center text-gray-800 font-semibold xl:mt-6 xl:mb-8">
                    Welcome to <span className="text-[#4534AC]">Workflo</span>!
                </h1>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4 sm:mb-6">
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full p-3 text-black bg-[#EBEBEB] rounded-lg border-transparent focus:outline-none focus:border focus:border-[#606060]"
                        />
                    </div>
                    <div className="mb-4 sm:mb-6 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-3 text-black bg-[#EBEBEB] rounded-lg border-transparent focus:outline-none focus:border focus:border-[#606060]"
                        />
                        <img
                            src="https://i.ibb.co/s3Rxvht/image.png"
                            alt="Show/Hide Password"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-3 cursor-pointer"
                            style={{ width: '24px', height: '24px' }}
                        />
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 mb-4">{errorMessage}</p>
                    )}
                    <button
                        className="w-full p-3 text-white rounded-lg transition duration-300 bg-[#4C38C2] hover:bg-gradient-to-b hover:from-[#4C38C2] hover:to-[#2F2188] shadow-md"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center xl:mt-8">
                    <p className="text-lg text-[#606060]">
                        Don't have an account? Create a{' '}
                        <Link className="font-bold hover:underline" href="/signup" style={{ color: '#0054A1' }}>
                            new account.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;