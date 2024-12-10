import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { Input, Textarea, Button, Card, Spacer } from '@nextui-org/react';

interface Note {
    id: number;
    title: string;
    content: string;
}

const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`/notes`);
            setNotes(response.data);
        } catch (error) {
            console.error('Fetch notes error:', error);
        }
    };

    const fetchNoteById = async (id: number) => {
        try {
            const response = await axios.get(`/notes/${id}`);
            const note = response.data;
            setTitle(note.title);
            setContent(note.content);
            setSelectedNoteId(note.id);
        } catch (error) {
            console.error('Fetch note by ID error:', error);
        }
    };
    
    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                `/notes`,
                { title, content }
            );
            setTitle('');
            setContent('');
            fetchNotes();
        } catch (error) {
            console.error('Add note error:', error);
        }
    };

    const handleUpdateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedNoteId !== null) {
            try {
                await axios.put(`/notes/${selectedNoteId}`, { title, content });
                setTitle('');
                setContent('');
                setSelectedNoteId(null);  
                fetchNotes();
            } catch (error) {
                console.error('Update note error:', error);
            }
        }
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await axios.delete(`/notes/${id}`);
            fetchNotes();
        } catch (error) {
            console.error('Delete note error:', error);
        }
    };

    return (
        <div style={{padding: '20px', backgroundColor: '#001f3f', minHeight: '100vh'}}>
            <h2 style={{textAlign: 'center', marginBottom: '20px', color: 'white'}}>Notes</h2>
            <Card
                style={{
                    backgroundColor: '#FFEB3B',
                    padding: '20px',
                    maxWidth: '250px',
                    margin: '0 auto',
                    borderRadius: '8px',
                    boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <form onSubmit={(e) => (selectedNoteId ? handleUpdateNote(e) : handleAddNote(e))}>
                    <Input
                        type="text"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <Spacer y={1} />
                    <Textarea
                        placeholder="Note Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{
                            resize: 'none',
                        }}
                    />
                    <Spacer y={1.5} />
                    <Button type="submit" color="primary" fullWidth>
                        {selectedNoteId ? 'Update Note' : 'Add Note'}
                    </Button>
                </form>
            </Card>
            <Spacer y={2}/>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
                {notes.map((note, index) => (
                    <Card
                        key={note.id}
                        style={{
                            backgroundColor: index % 2 === 0 ? '#FFEB3B' : '#4CAF50',
                            padding: '15px',
                            width: '200px',
                            minHeight: '150px',
                            borderRadius: '8px',
                            boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h3 style={{margin: '0 0 10px', fontSize: '16px'}}>{note.title}</h3>
                        <p style={{fontSize: '14px', lineHeight: '1.5'}}>{note.content}</p>
                        <div style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between'}}>
                            <Button size="sm" onClick={() => fetchNoteById(note.id)}>
                                Edit
                            </Button>
                            <Button size="sm" onClick={() => handleDeleteNote(note.id)}>
                                Delete
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NotesPage;
