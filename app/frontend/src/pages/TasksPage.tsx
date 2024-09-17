import React, { useEffect, useState } from 'react';
import axios from '../services/api';


interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/tasks`);
            setTasks(response.data);
        } catch (error) {
            console.error('Fetch tasks error:', error);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                `/tasks`,
                { title, description },
            );
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (error) {
            console.error('Add task error:', error);
        }
    };

    const handleUpdateTaskStatus = async (id: number, status: string) => {
        try {
            await axios.put(
                `/tasks/${id}/status`,
                { status }
            );
            fetchTasks();
        } catch (error) {
            console.error('Update task status error:', error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await axios.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Delete task error:', error);
        }
    };

    const statuses = ['To Do', 'In Progress', 'Done'];

    return (
        <div>
            <h2>Task Board</h2>
            <form onSubmit={handleAddTask}>
                <div>
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
          <textarea
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
          ></textarea>
                </div>
                <button type="submit">Add Task</button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {statuses.map((status) => (
                    <div key={status} style={{ width: '30%' }}>
                        <h3>{status}</h3>
                        <ul>
                            {tasks
                                .filter((task) => task.status === status)
                                .map((task) => (
                                    <li key={task.id}>
                                        <strong>{task.title}</strong>
                                        <p>{task.description}</p>
                                        <div>
                                            {statuses.map((s) => (
                                                <button
                                                    key={s}
                                                    disabled={s === status}
                                                    onClick={() => handleUpdateTaskStatus(task.id, s)}
                                                >
                                                    Move to {s}
                                                </button>
                                            ))}
                                            <button onClick={() => handleDeleteTask(task.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksPage;
