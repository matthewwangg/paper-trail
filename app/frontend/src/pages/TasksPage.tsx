import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Button, Card, CardContent, Typography, TextField, Select, MenuItem, Box, Paper } from '@mui/material';
import {DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided} from '@hello-pangea/dnd';

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

    const refreshData = async () => {
        await fetchTasks();
        await fetchGroupedTasksByStatus();
        await fetchGroupedTasksByPriority();
    };

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            const transformedTasks = response.data.map((task: any) => ({
                id: task.ID,
                ...task,
            }));
            setTasks(transformedTasks);
        } catch (error) {
            console.error('Fetch tasks error:', error);
        }
    };

    const fetchTaskById = async (id: number) => {
        try {
            const response = await api.get(`/tasks/${id}`);
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
            const response = await api.get('/tasks/grouped/status');
            const transformedGroups = Object.fromEntries(
                Object.entries(response.data).map(([key, tasks]) => [
                    key,
                    (tasks as any).map((task: any) => ({
                        id: task.ID,
                        ...task
                    }))
                ])
            );
            setGroupedTasksByStatus(transformedGroups);
        } catch (error) {
            console.error('Fetch grouped tasks by status error:', error);
        }
    };

    const fetchGroupedTasksByPriority = async () => {
        try {
            const response = await api.get('/tasks/grouped/priority');
            const transformedGroups = Object.fromEntries(
                Object.entries(response.data).map(([key, tasks]) => [
                    key,
                    (tasks as any).map((task: any) => ({
                        id: task.ID,
                        ...task
                    }))
                ])
            );
            setGroupedTasksByPriority(transformedGroups);
        } catch (error) {
            console.error('Fetch grouped tasks by priority error:', error);
        }
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { title, description, priority });
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
            await api.put(`/tasks/${id}`, updatedFields);
            await refreshData();
        } catch (error) {
            console.error('Update task error:', error);
        }
    };

    const handleUpdateTaskStatus = async (id: number, status: string) => {
        try {
            await api.put(`/tasks/${id}/status`, { status });
            await refreshData();
        } catch (error) {
            console.error('Update task status error:', error);
        }
    };

    const handleUpdateTaskPriority = async (id: number, priority: string) => {
        try {
            await api.put(`/tasks/${id}/priority`, { priority });
            await refreshData();
        } catch (error) {
            console.error('Update task status error:', error);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await api.delete(`/tasks/${id}`);
            await refreshData();
        } catch (error) {
            console.error('Delete task error:', error);
        }
    };

    const handleDragEnd = async (result: any) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;

        const taskId = parseInt(draggableId, 10);
        if (isNaN(taskId)) return console.error("Invalid task ID:", draggableId);

        try {
            const fieldToUpdate = viewMode === "status" ? "status" : "priority";
            const taskToUpdate = tasks.find((task) => task.id === taskId);

            if (!taskToUpdate) return console.error("Task not found:", taskId);

            const updatedTask = { ...taskToUpdate, [fieldToUpdate]: destination.droppableId };
            await api.put(`/tasks/${taskId}`, updatedTask);

            setTasks((prev) =>
                prev.map((task) => (task.id === taskId ? updatedTask : task))
            );

            if (viewMode === "status") fetchGroupedTasksByStatus();
            else fetchGroupedTasksByPriority();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };


    const TaskList = (data: { [key: string]: Task[] }, keys: string[], field: 'status' | 'priority') =>
        keys.map((key) => (
            <Droppable droppableId={key.trim()} key={key.trim()} type="group">
                {(provided: DroppableProvided) => (
                    <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ backgroundColor: '#161B22', border: '1px solid #30363D', flex: 1, padding: 2, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#58A6FF' }}>{key}</Typography>
                        {(data[key] || []).map((task: Task, index: number) => (
                            <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                                {(provided: DraggableProvided) => (
                                    <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ marginBottom: 1, backgroundColor: '#21262D', borderRadius: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" sx={{ color: '#C9D1D9' }}>{task.title}</Typography>
                                            <Typography variant="body2" sx={{ color: '#8B949E', wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: '100%', display: 'block' }}>{task.description}</Typography>                                            <Typography variant="caption" sx={{ color: '#79C0FF', display: 'block' }}>Priority: {task.priority}</Typography>
                                            <Typography variant="caption" sx={{ color: '#79C0FF', display: 'block' }}>Status: {task.status}</Typography>
                                            <Box mt={1} display="flex" gap={1}>
                                                <Button size="small" variant="outlined" sx={{ color: '#FF7B72', borderColor: '#FF7B72' }} onClick={() => handleDeleteTask(task.id)}>Delete</Button>
                                                {(field === 'status' ? statuses : priorities).map((val) => (
                                                    <Button key={val} size="small" variant="contained" disabled={val === task[field]} sx={{ backgroundColor: val === task[field] ? '#30363D' : '#28A745', color: '#fff' }} onClick={() => field === 'status' ? handleUpdateTaskStatus(task.id, val) : handleUpdateTaskPriority(task.id, val)}>
                                                        {field === 'status' ? `Move to ${val}` : `Set Priority ${val}`}
                                                    </Button>
                                                ))}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Paper>
                )}
            </Droppable>
        ));

    return (
        <Box sx={{ backgroundColor: '#0D1117', color: '#C9D1D9', minHeight: '100vh', padding: 4 }}>
            <Typography variant="h4" gutterBottom>Task Board</Typography>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <TextField value={title} onChange={(e) => setTitle(e.target.value)} label="Title" variant="outlined" size="small" sx={{ backgroundColor: '#20232A', color: '#C9D1D9', borderRadius: 1, '& .MuiInputLabel-root': { color: '#8B949E' } }} />
                <TextField value={description} onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" size="small" sx={{ backgroundColor: '#20232A', color: '#C9D1D9', borderRadius: 1, '& .MuiInputLabel-root': { color: '#8B949E' } }} />
                <Select value={priority} onChange={(e) => setPriority(e.target.value)} size="small" sx={{ backgroundColor: '#20232A', color: '#C9D1D9', borderRadius: 1 }}>
                    {priorities.map(p => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
                </Select>
                <Button type="submit" variant="contained" sx={{ backgroundColor: '#28A745', color: '#fff', marginRight: 'auto' }}>Add Task</Button>
                <Button variant="outlined" sx={{ color: '#C9D1D9', borderColor: '#C9D1D9', marginRight: 2 }} onClick={() => setViewMode('status')}>View by Status</Button>
                <Button variant="outlined" sx={{ color: '#C9D1D9', borderColor: '#C9D1D9' }} onClick={() => setViewMode('priority')}>View by Priority</Button>
            </form>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Box display="flex" gap={2}>
                    {viewMode === 'status' ? TaskList(groupedTasksByStatus, statuses, 'status') : TaskList(groupedTasksByPriority, priorities, 'priority')}
                </Box>
            </DragDropContext>
        </Box>
    );
};

export default TasksPage;
