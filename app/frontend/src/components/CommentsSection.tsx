import React, { useState, useEffect } from 'react';
import axios from '../services/api';

interface Comment {
    id: number;
    content: string;
    task_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface CommentsSectionProps {
    taskId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ taskId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, [taskId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/tasks/${taskId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`/tasks/${taskId}/comments`, {
                content: newComment,
            });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div>
            <h3>Comments</h3>

            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} style={{ marginBottom: '1rem' }}>
                        <p>{comment.content}</p>
                        <small>
                            By User {comment.user_id} on {new Date(comment.created_at).toLocaleString()}
                        </small>
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}

            <form onSubmit={handleAddComment}>
        <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            rows={3}
            style={{ width: '100%' }}
        ></textarea>
                <button type="submit">Post Comment</button>
            </form>
        </div>
    );
};

export default CommentsSection;
