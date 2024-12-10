import React, { useEffect, useState } from 'react';
import axios from '../services/api';

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
}

const statuses = ['To Do', 'In Progress', 'Done'];
const priorities = ['low', 'medium', 'high'];

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [groupedTasksByStatus, setGroupedTasksByStatus] = useState<{ [status: string]: Task[] }>({});
    const [groupedTasksByPriority, setGroupedTasksByPriority] = useState<{ [priority: string]: Task[] }>({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [viewMode, setViewMode] = useState<'status' | 'priority'>('status');

    useEffect(() => {
        refreshData();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('/tasks');
            setTasks(response.data);
        } catch (error) {
            console.error('Fetch tasks error:', error);
        }
    };

    const fetchTaskById = async (id: number) => {
        try {
            const response = await axios.get(`/tasks/${id}`);
            const task = response.data;
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
        } catch (error) {
            console.error('Fetch task by ID error:', error);
        }
    };

    const fetchGroupedTasksByStatus = async () => {
        try {
            const response = await axios.get('/tasks/grouped/status');
            setGroupedTasksByStatus(response.data);
        } catch (error) {
            console.error('Fetch grouped tasks by status error:', error);
        }
    };

    const fetchGroupedTasksByPriority = async () => {
        try {
            const response = await axios.get('/tasks/grouped/priority');
            setGroupedTasksByPriority(response.data);
        } catch (error) {
            console.error('Fetch grouped tasks by priority error:', error);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/tasks', { title, description, priority });
            setTitle('');
            setDescription('');
            setPriority('medium');
            await refreshData();
        } catch (error) {
            console.error('Add task error:', error);
        }
    };

    const handleUpdateTask = async (id: number, updatedFields: Partial<Task>) => {
        try {
            await axios.put(`/tasks/${id}`, updatedFields);
            await refreshData();
        } catch (error) {
            console.error('Update task error:', error);
        }
    };

    const handleUpdateTaskStatus = async (id: number, status: string) => {
        try {
            await axios.put(`/tasks/${id}/status`, { status });
            await refreshData();
        } catch (error) {
            console.error('Update task status error:', error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await axios.delete(`/tasks/${id}`);
            await refreshData();
        } catch (error) {
            console.error('Delete task error:', error);
        }
    };

    // Refresh data after any change
    const refreshData = async () => {
        await fetchTasks();
        await fetchGroupedTasksByStatus();
        await fetchGroupedTasksByPriority();
    };

    const TaskList = (data: { [key: string]: Task[] }, keys: string[], field: 'status' | 'priority') =>
        keys.map((key) => (
            <div key={key}>
                <h3>{key}</h3>
                {(data[key] || []).map((task: Task) => (
                    <div key={task.id}>
                        <strong onClick={() => fetchTaskById(task.id)}>{task.title}</strong>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                        {(field === 'status' ? statuses : priorities).map((val) => (
                            <button key={val} disabled={val === task[field]} onClick={() => handleUpdateTaskStatus(task.id, val)}>
                                {field === 'status' ? `Move to ${val}` : `Set Priority ${val}`}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        ));

    return (
        <>
            <form onSubmit={handleAddTask}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <button type="submit">Add Task</button>
            </form>

            <div>
                <button onClick={() => setViewMode('status')}>View by Status</button>
                <button onClick={() => setViewMode('priority')}>View by Priority</button>
            </div>

            {viewMode === 'status' ? TaskList(groupedTasksByStatus, statuses, 'status') : TaskList(groupedTasksByPriority, priorities, 'priority')}
        </>
    );
};

export default TasksPage;
