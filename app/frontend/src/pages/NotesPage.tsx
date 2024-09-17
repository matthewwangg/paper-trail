import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Note {
    id: number;
    title: string;
    content: string;
}

const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const API_URL = 'http://localhost:8080';

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_URL}/notes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(response.data);
        } catch (error) {
            console.error('Fetch notes error:', error);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(
                `${API_URL}/notes`,
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTitle('');
            setContent('');
            fetchNotes();
        } catch (error) {
            console.error('Add note error:', error);
        }
    };

    const handleDeleteNote = async (id: number) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/notes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchNotes();
        } catch (error) {
            console.error('Delete note error:', error);
        }
    };

    return (
        <div>
            <h2>Notes</h2>
            <form onSubmit={handleAddNote}>
                <div>
                    <input
                        type="text"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
          <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
          ></textarea>
                </div>
                <button type="submit">Add Note</button>
            </form>
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <strong>{note.title}</strong>
                        <p>{note.content}</p>
                        <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotesPage;
