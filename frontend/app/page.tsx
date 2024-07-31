'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SidebarComponent from "@/components/Sidebar";
import HomePage from "./home";

interface User {
  _id: string;
  name: string;
  email: string;
  date: string;
  __v: number;
}

// Home component to manage user authentication and render the main page
export default function Home() {
  const pathname: string = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // useEffect hook to check if the user is logged in
  useEffect(() => {
    const checkLogin = async () => {
      const authToken = localStorage.getItem('authtoken');
      if (!authToken) {
        router.push('/login');
      } else {
        try {
          const response = await fetch('http://localhost:5000/api/auth/userdetails', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': authToken
            }
          });

          if (response.ok) {
            const data: User = await response.json();
            setUser(data);
          } else {
            console.error('Failed to fetch user details');
            router.push('/login');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
          router.push('/login');
        }
      }
    };

    checkLogin();
  }, [router]);

  // Render a loading indicator while user data is being fetched
  if (!user) {
    return <div>Loading...</div>; 
  }

  return (
    <main className="flex min-h-full">
      {/* Sidebar component */}
      <SidebarComponent pathname={pathname} user={user} /> 
      
      {/* Main section */}
      <section>
        <HomePage user={user} />
      </section>
    </main>
  );
}
