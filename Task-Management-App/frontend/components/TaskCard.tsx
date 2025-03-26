import React from 'react';
import { Clock3 } from 'lucide-react';

export interface Task {
    _id: any;
    title: string;
    description: string;
    deadline: string;
    status: string;
    date: Date | string;
    priority: 'Low' | 'Medium' | 'Urgent';
}

interface TaskCardProps {
    task: Task;
}

// Function to format the deadline date
const formatDate = (deadline: string): string => {
    const date = new Date(deadline);
    return date.toLocaleDateString();
};

// Function to calculate the time difference in hours from the given date to the current date
const calculateTimeDifference = (date: Date | string): string | number => {
    const deadlineDate = new Date(date);
    if (isNaN(deadlineDate.getTime())) {
        return 'Invalid date';
    }
    const currentDate = new Date();
    const diffInMs = Math.abs(currentDate.getTime() - deadlineDate.getTime());
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return diffInHours;
};

// TaskCard component to display individual task details
const TaskCard: React.FC<TaskCardProps> = ({ task }) => (
    <div className="mb-4 p-4 bg-[#F9F9F9] rounded-lg shadow-sm border border-gray-200">
        <h4 className="mb-2 text-lg font-semibold text-[#606060]">{task.title}</h4>
        <p className="mb-2 text-[#797979]">{task.description}</p>

        {/* Display task priority with corresponding colors */}
        {task.priority === 'Urgent' && (
            <div className="bg-[#FF6B6B] w-fit mb-2 text-white px-3 py-2 rounded-xl text-sm">{task.priority}</div>
        )}
        {task.priority === 'Medium' && (
            <div className="bg-[#FFA235] w-fit mb-2 text-white px-3 py-2 rounded-xl text-sm">{task.priority}</div>
        )}
        {task.priority === 'Low' && (
            <div className="bg-[#0ECC5A] w-fit mb-2 text-white px-3 py-2 rounded-xl text-sm">{task.priority}</div>
        )}

        {/* Display deadline date */}
        <div className="flex items-center mb-2">
            <Clock3 className="w-5 h-5 mr-1 text-[#606060]" />
            <span className='text-[#606060]'>{formatDate(task.deadline)}</span>
        </div>

        {/* Display time difference in hours */}
        <p className="text-[#797979] text-xs">{calculateTimeDifference(task.date)} hrs ago</p>
    </div>
);

export default TaskCard;