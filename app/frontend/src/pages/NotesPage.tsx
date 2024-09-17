import React, { useEffect, useState } from 'react';
import axios from '../services/api';

interface Note {
    id: number;
    title: string;
    content: string;
}

const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

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

    const handleDeleteNote = async (id: number) => {
        try {
            await axios.delete(`/notes/${id}`);
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
