import React, { useState } from 'react';
import { Plus, ListFilter } from "lucide-react";
// @ts-ignore
import { Draggable, Droppable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd-next';
import TaskCard from "./TaskCard";
import { Task } from "./TaskCard";
import TaskModal from './TaskModal';

interface KanbanColumnProps {
    title: string;
    tasks: Task[];
}

// KanbanColumn component for displaying a column of tasks in the Kanban board
const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the task modal
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    // Function to close the task modal
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <Droppable droppableId={title}>
            {(provided: DroppableProvided) => (
                <div
                    className="flex-1 p-4 rounded-lg"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {/* Column header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-[#555555]">{title}</h3>
                        <ListFilter className="w-6 h-6 text-[#555555]" />
                    </div>

                    {/* Task cards */}
                    {tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task.title} index={index}>
                            {(provided: DraggableProvided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <TaskCard task={task} />
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Add new task button */}
                    <button
                        className="w-full p-2 bg-gradient-to-b from-[#3A3A3A] to-[#202020] text-white rounded-lg flex items-center justify-between"
                        onClick={handleModalOpen}
                    >
                        <span className="text-[#E3E1E1] p-1">Add new</span> <Plus className="mr-2 w-6 h-6" />
                    </button>

                    {/* Task modal for adding new tasks */}
                    <TaskModal isOpen={isModalOpen} onClose={handleModalClose} initialStatus={title} />
                </div>
            )}
        </Droppable>
    );
};

export default KanbanColumn;
