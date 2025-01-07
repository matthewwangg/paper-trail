import React, { useEffect, useState } from 'react';
import { Box, Card, CardActions, Typography, Fab, Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormInput from '../components/FormInput';
import api from '../services/api';

interface Note {
    ID: number;
    title: string;
    content: string;
    user_id: string;
}

const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await api.get(`/notes`);
            setNotes(response.data);
        } catch (error) {
            console.error('Fetch notes error:', error);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/notes`, { title, content });
            resetForm();
            fetchNotes();
        } catch (error) {
            console.error('Add note error:', error);
        }
    };

    const handleUpdateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedNoteId !== null) {
            try {
                await api.put(`/notes/${selectedNoteId}`, { title, content });
                resetForm();
                fetchNotes();
            } catch (error) {
                console.error('Update note error:', error);
            }
        }
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await api.delete(`/notes/${id}`);
            fetchNotes();
        } catch (error) {
            console.error('Delete note error:', error);
        }
    };

    const handleEditNote = (note: Note) => {
        setTitle(note.title);
        setContent(note.content);
        setSelectedNoteId(note.ID);
        setOpen(true);
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setSelectedNoteId(null);
        setOpen(false);
    };

    const stickyNoteColors = ['#FFD580', '#FFABAB', '#FFCCF9', '#85E3FF', '#B9FBC0', '#FFC09F', '#A7F3D0'];

    return (
        <Box sx={{ p: 4, backgroundColor: 'black', minHeight: '100vh' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                {notes.length ? (
                    notes.map((note, index) => (
                        <Card
                            key={note.ID}
                            sx={{
                                backgroundColor: stickyNoteColors[index % stickyNoteColors.length],
                                height: 300,
                                p: 2,
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                                {note.title.slice(0, 20)}{note.title.length > 20 && '...'}
                            </Typography>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    overflowY: 'auto',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    fontSize: '1rem',
                                    mb: 2,
                                }}
                            >
                                <Typography variant="body2">{note.content}</Typography>
                            </Box>
                            <CardActions sx={{ justifyContent: 'space-between' }}>
                                <Button size="small" onClick={() => handleEditNote(note)}>Edit</Button>
                                <Button size="small" color="error" onClick={() => handleDeleteNote(note.ID)}>Delete</Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    <Typography color="textSecondary" align="center">No notes available. Click "+" to add one!</Typography>
                )}
            </Box>
            <Fab sx={{ position: 'fixed', bottom: 16, right: 16, bgcolor: '#4ADE80', '&:hover': { bgcolor: '#3CA769' } }} onClick={() => setOpen(true)}>
                <AddIcon />
            </Fab>
            <Dialog open={open} onClose={resetForm} PaperProps={{ style: { backgroundColor: 'black', color: 'white', borderRadius: '8px' } }}>
                <DialogTitle sx={{ color: '#4ADE80', textAlign: 'center' }}>{selectedNoteId ? 'Edit Note' : 'Add Note'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={selectedNoteId ? handleUpdateNote : handleAddNote}>
                        <FormInput placeholder="Title (max 20 characters)" value={title} onChange={(value) => setTitle(value.slice(0, 20))} />
                        <FormInput placeholder="Content" value={content} onChange={setContent} />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, bgcolor: '#4ADE80', '&:hover': { bgcolor: '#3CA769' } }}>
                            {selectedNoteId ? 'Update Note' : 'Add Note'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default NotesPage;