import React from 'react';
import InfoCard from '@/components/InfoCard';
import Toolbar from '@/components/Toolbar';
import KanbanBoard from '@/components/KanbanBoard';
import { CircleHelp } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  date: string;
  __v: number;
}

interface HomePageProps {
  user: User;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  return (
    <div className="p-6 flex flex-col w-full h-screen bg-[#F7F7F7] overflow-hidden">
      {/* Header section */}
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-[#080808]">Good morning, {user.name}!</h1>
        <a href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
          Help & feedback <span className="ml-1 text-lg"><CircleHelp /></span>
        </a>
      </header>

      {/* Info cards section */}
      <div className="flex gap-4 mb-6">
        <InfoCard
          title="Introducing tags"
          description="Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient."
          icon={<img src="https://i.ibb.co/61WBC9Q/image.png" alt="Tags" className="w-[77px] h-[61px]" />}
        />
        <InfoCard
          title="Share Notes Instantly"
          description="Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options."
          icon={<img src="https://i.ibb.co/WPLK7Xy/image.png" alt="Share" className="w-[77px] h-[61px]" />}
        />
        <InfoCard
          title="Access Anywhere"
          description="Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer."
          icon={<img src="https://i.ibb.co/82jsdzR/image.png" alt="Access" className="w-[77px] h-[61px]" />}
        />
      </div>

      {/* Toolbar component */}
      <Toolbar />

      {/* Kanban board component */}
      <KanbanBoard />
    </div>
  );
};

export default HomePage;
