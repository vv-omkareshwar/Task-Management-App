import React, { useState, useEffect } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Maximize2, X, Share2, Star, Loader, AlertCircle, Calendar, Edit3, Plus, CirclePlus } from 'lucide-react';
import { useAppDispatch, setTriggerFetch } from '../store/store';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialStatus: string;
}

interface Task {
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
}

const useDeadlineState = (initialValue: Date | undefined) => {
    const [deadline, setDeadline] = useState<Date | undefined>(initialValue);
    const [deadlineError, setDeadlineError] = useState<string | null>(null);

    const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDeadlineError(null);

        if (!inputValue) {
            setDeadline(undefined);
        } else {
            const newDate = parseISO(inputValue + 'T00:00:00Z');
            if (isValid(newDate)) {
                if (newDate < new Date()) {
                    setDeadlineError('Deadline cannot be in the past');
                } else {
                    setDeadline(newDate);
                }
            } else {
                setDeadlineError('Invalid date input');
            }
        }
    };

    return { deadline, deadlineError, handleDeadlineChange };
};

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, initialStatus }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<string>(initialStatus);
    const [priority, setPriority] = useState<string>('Low');
    const { deadline, deadlineError, handleDeadlineChange } = useDeadlineState(undefined);
    const [visible, setVisible] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            setTimeout(() => setAnimating(true), 10);
        } else {
            setAnimating(false);
            setTimeout(() => setVisible(false), 500);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const task: Task = {
            title,
            description,
            status,
            priority,
            deadline: deadline ? deadline.toISOString() : new Date().toISOString(),
        };

        const authToken = localStorage.getItem('authtoken');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${authToken}`
                },
                body: JSON.stringify(task)
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            dispatch(setTriggerFetch(true));
            onClose();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    if (!visible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end items-top z-50 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`relative p-4 w-full max-w-3xl bg-white max-h-full h-full transform transition-transform duration-500 ${animating ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-5">
                        <X className="text-[#666666] cursor-pointer" size={24} onClick={onClose} />
                        <Maximize2 className="text-[#666666] cursor-pointer" size={20} />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            className="text-[#666666] bg-[#F4F4F4] rounded-md w-auto inline-flex justify-center items-center px-3 py-2"
                        >
                            Share
                            <Share2 className="ml-3" />
                        </button>
                        <button
                            type="button"
                            className="text-[#666666] bg-[#F4F4F4] rounded-md w-auto inline-flex justify-center items-center px-3 py-2"
                        >
                            Favorite
                            <Star className="ml-3" />
                        </button>
                    </div>
                </div>

                <form className="p-4 md:p-5 h-full overflow-y-auto" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="w-full border-none text-[#CCCCCC] text-5xl font-semibold mb-4 focus:outline-none"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <Loader className="text-[#666666]" size={20} />
                            <label className="w-32 text-[#666666]">Status</label>
                            <select
                                className="text-[#666666] border-none focus:outline-none"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="To-Do">To-Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Finished">Finished</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-3">
                            <AlertCircle className="text-[#666666]" size={20} />
                            <label className="w-32 text-[#666666]">Priority</label>
                            <select
                                className="text-[#666666] border-none focus:outline-none"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Calendar className="text-[#666666]" size={20} />
                            <label className="w-32 text-[#666666]">Deadline</label>
                            <input
                                type="date"
                                className={`text-[#666666] border-none ml-1 focus:outline-none ${deadlineError ? 'border-red-500' : ''}`}
                                value={deadline ? format(deadline, 'yyyy-MM-dd') : ''}
                                onChange={handleDeadlineChange}
                                min={format(new Date(), 'yyyy-MM-dd')}
                            />
                            {deadlineError && <span className="text-red-500 text-sm">{deadlineError}</span>}
                        </div>
                        {deadline && (
                            <p className="text-sm text-gray-500 mt-1">
                                Deadline set to: {format(deadline, 'MMMM d, yyyy')}
                            </p>
                        )}

                        <div className="flex items-center space-x-3">
                            <Edit3 className="text-[#666666]" size={20} />
                            <label className="w-32 text-[#666666]">Description</label>
                            <input
                                type="text"
                                className="text-[#666666] focus:outline-none"
                                placeholder="Not selected"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="mt-6 text-black hover:underline inline-flex items-center"
                    >
                        <Plus className="mr-2" size={20} />
                        Add custom property
                    </button>

                    <hr className="border-t border-[#DEDEDE] my-4" />

                    <textarea
                        className="w-full border-none text-[#666666] p-2 mt-4 focus:outline-none focus:ring-2 focus:ring-[#DEDEDE]"
                        placeholder="Start writing, or drag your own files here."
                        rows={10}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="p-3 text-white rounded-lg transition duration-300 bg-[#4C38C2] hover:bg-gradient-to-b hover:from-[#4C38C2] hover:to-[#2F2188] shadow-md flex items-center justify-center space-x-2 mt-4"
                    >
                        <span>Add task</span>
                        <CirclePlus />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;