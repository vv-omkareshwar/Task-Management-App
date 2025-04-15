import React, { useState } from 'react';
import { Calendar, Filter, PlusCircle, Search, Share2, Sparkles } from 'lucide-react';
import TaskModal from './TaskModal';

// Toolbar component to display a set of tools and actions
const Toolbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Function to open the task modal
  const handleModalOpen = (): void => {
    setIsModalOpen(true);
  };

  // Function to close the task modal
  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex items-center gap-4 mb-6 p-2">
      {/* Search bar */}
      <div className="flex-grow">
        <div className="relative" style={{ maxWidth: '300px', marginRight: 'auto' }}>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Calendar view button */}
      <button className="text-[#797979] px-4 py-2 rounded-md flex items-center justify-between hover:bg-gray-100">
        <span>Calendar view</span>
        <Calendar className="w-5 h-5 ml-2" />
      </button>

      {/* Automation button */}
      <button className="text-[#797979] px-4 py-2 rounded-md flex items-center justify-between hover:bg-gray-100">
        <span>Automation</span>
        <Sparkles className="w-5 h-5 ml-2" />
      </button>

      {/* Filter button */}
      <button className="text-[#797979] px-4 py-2 rounded-md flex items-center justify-between hover:bg-gray-100">
        <span>Filter</span>
        <Filter className="w-5 h-5 ml-2" />
      </button>

      {/* Share button */}
      <button className="text-[#797979] px-4 py-2 rounded-md flex items-center justify-between hover:bg-gray-100">
        <span>Share</span>
        <Share2 className="w-5 h-5 ml-2" />
      </button>

      {/* Create new task button */}
      <button
        className="text-white px-4 py-2 rounded-lg bg-[#4C38C2] hover:bg-gradient-to-b hover:from-[#4C38C2] hover:to-[#2F2188] shadow-md flex items-center justify-center"
        onClick={handleModalOpen}
      >
        <span>Create new</span>
        <PlusCircle className="w-5 h-5 ml-2" />
      </button>

      {/* Task modal for creating new tasks */}
      <TaskModal isOpen={isModalOpen} onClose={handleModalClose} initialStatus="To-Do" />
    </div>
  );
};

export default Toolbar;