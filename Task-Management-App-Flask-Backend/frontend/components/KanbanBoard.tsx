import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd-next';
import KanbanColumn from './KanbanBoardColumn';
import styles from '@/styles/KanbanBoard.module.css';
import { Task } from './TaskCard';
import { useAppDispatch, useAppSelector, setTriggerFetch } from '@/store/store';

// Function to handle the status change of a moved task
const handleChange = async (movedTask: any, destination: any): Promise<void> => {
    const authToken = localStorage.getItem('authtoken') || '';

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task/${movedTask._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken
            },
            body: JSON.stringify({ status: destination.droppableId }),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const dispatch = useAppDispatch();
    const triggerFetch = useAppSelector(state => state.app.triggerFetch);

    // useEffect hook to fetch tasks when component mounts or triggerFetch changes
    useEffect(() => {
        const fetchTasks = async () => {
            const authToken = localStorage.getItem('authtoken') || '';

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/task`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': authToken
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                setTasks(data);
                dispatch(setTriggerFetch(false));
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        if (triggerFetch) {
            fetchTasks();
        }
    }, [triggerFetch, dispatch]);

    // Handle the end of a drag event
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = tasks.filter(task => task.status === source.droppableId);
        const finish = tasks.filter(task => task.status === destination.droppableId);

        const movedTask = tasks.find(task => task.title === draggableId);

        if (movedTask) {
            handleChange(movedTask, destination);
        }

        if (start === finish) {
            const newTasks = Array.from(start);
            const [removed] = newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, removed);

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.title === draggableId ? { ...task, status: destination.droppableId } : task
                )
            );
        } else {
            const startTasks = Array.from(start);
            const finishTasks = Array.from(finish);
            const [removed] = startTasks.splice(source.index, 1);
            finishTasks.splice(destination.index, 0, removed);

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.title === draggableId ? { ...task, status: destination.droppableId } : task
                )
            );
        }
    };

    // Get tasks for a specific column status
    const getColumnTasks = (status: string) => tasks.filter(task => task.status === status);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={`h-screen ${styles.scrollbar}`}>
                <div className="flex gap-4 bg-white rounded-lg">
                    <KanbanColumn title="To-Do" tasks={getColumnTasks("To-Do")} />
                    <KanbanColumn title="In Progress" tasks={getColumnTasks("In Progress")} />
                    <KanbanColumn title="Under Review" tasks={getColumnTasks("Under Review")} />
                    <KanbanColumn title="Finished" tasks={getColumnTasks("Finished")} />
                </div>
            </div>
        </DragDropContext>
    );
};

export default KanbanBoard;