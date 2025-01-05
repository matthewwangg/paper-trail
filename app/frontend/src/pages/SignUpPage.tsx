import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import FormWrapper from '../components/FormWrapper';

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {
        setLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { username, password });
            alert('Registration successful. Please login.');
            navigate('/login');
        } catch {
            alert('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FormWrapper
                title="Signup"
                fields={[
                    { placeholder: 'Username', value: username, onChange: setUsername },
                    { placeholder: 'Password', value: password, onChange: setPassword, type: 'password' },
                ]}
                onSubmit={handleSignup}
                buttonLabel="Signup"
                loading={loading}
                additionalContent={
                    <Typography sx={{ mt: 2, color: 'white' }}>
                        Already have an account? <Typography component="span" sx={{ color: '#4ADE80', cursor: 'pointer', '&:hover': { color: '#3CA769' }} } onClick={() => navigate('/login')}>Login</Typography>
                    </Typography>
                }
            />
        </Box>
    );
};

export default SignupPage;