"use client";

import Link from 'next/link';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Signup: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isWarmingUp, setIsWarmingUp] = useState<boolean>(true);

    const router = useRouter();

    useEffect(() => {
        const authToken = localStorage.getItem('authtoken');
        if (authToken) {
            router.push('/');
        }

        const fetchWarmUp = async () => {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/`);
            } catch (error) {
                console.error('Error warming up backend:', error);
            } finally {
                setIsWarmingUp(false);
            }
        };

        fetchWarmUp();
    }, [router]);

    const togglePasswordVisibility = (): void => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const validateEmail = (email: string): boolean => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password: string): boolean => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!name.trim()) {
            setErrorMessage('Full name is required');
            return;
        }
        if (!validateEmail(email)) {
            setErrorMessage('Invalid email address');
            return;
        }
        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            return;
        }
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('authtoken', data.authtoken);
                console.log('Signup successful!');
                router.push('/');
            } else {
                setErrorMessage(data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during signup:', error);
            setErrorMessage('An error occurred. Please check your network connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setPassword(e.target.value);
    };

    if (isWarmingUp) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen px-4" style={{ background: 'linear-gradient(to bottom, white, #AFA3FF)' }}>
            <div className="w-full max-w-lg lg:max-w-xl xl:max-w-[648px] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 bg-white border border-[#CECECE] rounded-2xl flex flex-col items-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl mb-6 text-center text-gray-800 font-semibold xl:mt-6 xl:mb-8">
                    Welcome to <span className="text-[#4534AC]">Workflo</span>!
                </h1>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4 sm:mb-6">
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full p-3 text-black bg-[#EBEBEB] rounded-lg border-transparent focus:outline-none focus:border focus:border-[#606060]"
                        />
                    </div>
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
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </button>
                </form>
                <div className="mt-6 text-center xl:mt-8">
                    <p className="text-lg text-[#606060]">
                        Already have an account?{' '}
                        <Link className="font-bold hover:underline" href="/login" style={{ color: '#0054A1' }}>
                            Log in.
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;