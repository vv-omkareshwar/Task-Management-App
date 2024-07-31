import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    BellDot,
    ChartLine,
    ChevronsRight,
    CirclePlus,
    Home,
    Settings,
    SquareKanban,
    Sun,
    Users,
} from 'lucide-react';
import TaskModal from './TaskModal';

interface User {
    _id: string;
    name: string;
    email: string;
    date: string;
    __v: number;
}

interface SidebarComponentProps {
    user: User;
    pathname: string;
}

// SidebarComponent to display the sidebar with user info, navigation, and task creation
const SidebarComponent: React.FC<SidebarComponentProps> = ({ user, pathname }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    // Function to open the task modal
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    // Function to close the task modal
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Function to handle user logout
    const handleLogout = () => {
        localStorage.removeItem('authtoken');
        router.push('/login');
    };

    return (
        <>
            <aside className="border-r min-w-[285px] pt-6 px-4 pb-8 md:block">
                {/* User info section */}
                <div className="flex items-center mb-2">
                    <img
                        src={`https://avatar.iran.liara.run/username?username=${user.name}`}
                        alt="Profile"
                        className="w-[31px] h-[31px] rounded-full"
                    />
                    <h1 className="ml-2 text-xl font-medium">{user.name}</h1>
                </div>

                {/* Notification and settings section */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex">
                        <BellDot className="w-6 h-6 mr-5 cursor-pointer" color="#666666" />
                        <Sun className="w-6 h-6 mr-5 cursor-pointer" color="#666666" />
                        <ChevronsRight className="w-6 h-6 cursor-pointer" color="#666666" />
                    </div>
                    <div>
                        <button
                            className="bg-gray-200 text-gray-600 rounded-lg px-4 py-2"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Navigation menu */}
                <div className="mt-4 text-lg">
                    <ul className="flex flex-col gap-2 text-[#797979]">
                        <li className={`p-2 rounded-lg flex items-center ${pathname === '/' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                            <Home className="w-6 h-6 mr-4" color="#666666" />
                            Home
                        </li>
                        <li className={`p-2 rounded-lg flex items-center ${pathname === '/board' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                            <SquareKanban className="w-6 h-6 mr-4" color="#666666" />
                            Boards
                        </li>
                        <li className={`p-2 rounded-lg flex items-center ${pathname === '/settings' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                            <Settings className="w-6 h-6 mr-4" color="#666666" />
                            Settings
                        </li>
                        <li className={`p-2 rounded-lg flex items-center ${pathname === '/teams' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                            <Users className="w-6 h-6 mr-4" color="#666666" />
                            Teams
                        </li>
                        <li className={`p-2 rounded-lg flex items-center ${pathname === '/analytics' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}>
                            <ChartLine className="w-6 h-6 mr-4" color="#666666" />
                            Analytics
                        </li>
                    </ul>
                </div>

                {/* Create new task button */}
                <div className="mt-6">
                    <button
                        className="w-full p-3 text-white rounded-lg transition duration-300 bg-[#4C38C2] hover:bg-gradient-to-b hover:from-[#4C38C2] hover:to-[#2F2188] shadow-md flex items-center justify-center space-x-2"
                        onClick={handleModalOpen}
                    >
                        <span>Create new task</span> <CirclePlus />
                    </button>
                </div>

                {/* Footer section */}
                <footer className="mt-4 absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-gray-500">
                        Download the app <br />
                        <span className="underline">Get the full experience</span>
                    </p>
                </footer>
            </aside>
            
            {/* Task modal for creating new tasks */}
            <TaskModal isOpen={isModalOpen} onClose={handleModalClose} initialStatus='To-Do' />
        </>
    );
};

export default SidebarComponent;
