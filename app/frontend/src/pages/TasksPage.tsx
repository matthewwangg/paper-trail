import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const API_URL = 'http://localhost:8080';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Fetch tasks error:', error);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${API_URL}/tasks`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (error) {
            console.error('Add task error:', error);
        }
    };

    const handleUpdateTaskStatus = async (id: number, status: string) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${API_URL}/tasks/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (error) {
            console.error('Update task status error:', error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
