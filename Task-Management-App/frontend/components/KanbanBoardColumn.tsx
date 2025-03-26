import React, { useState } from 'react';
import { Plus, ListFilter } from "lucide-react";
import { Draggable, Droppable, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd-next';
import TaskCard, { Task } from "./TaskCard";
import TaskModal from './TaskModal';

interface KanbanColumnProps {
    title: string;
    tasks: Task[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleModalOpen = (): void => {
        setIsModalOpen(true);
    };

    const handleModalClose = (): void => {
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
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-[#555555]">{title}</h3>
                        <ListFilter className="w-6 h-6 text-[#555555]" />
                    </div>

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

                    <button
                        className="w-full p-2 bg-gradient-to-b from-[#3A3A3A] to-[#202020] text-white rounded-lg flex items-center justify-between"
                        onClick={handleModalOpen}
                    >
                        <span className="text-[#E3E1E1] p-1">Add new</span> <Plus className="mr-2 w-6 h-6" />
                    </button>

                    <TaskModal isOpen={isModalOpen} onClose={handleModalClose} initialStatus={title} />
                </div>
            )}
        </Droppable>
    );
};

export default KanbanColumn;