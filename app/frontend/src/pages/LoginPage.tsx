import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import FormWrapper from '../components/FormWrapper';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setLoginFailed(false);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/notes');
        } catch {
            setLoginFailed(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FormWrapper
                title="Login"
                fields={[
                    { placeholder: 'Username', value: username, onChange: setUsername },
                    { placeholder: 'Password', value: password, onChange: setPassword, type: 'password' },
                ]}
                onSubmit={handleLogin}
                buttonLabel="Login"
                loading={loading}
                errorMessage={loginFailed ? 'Login failed. Please check your credentials.' : undefined}
                additionalContent={
                    <Typography sx={{ mt: 2, color: 'white' }}>
                        Don't have an account? <Typography component="span" sx={{ color: '#4ADE80', cursor: 'pointer', '&:hover': { color: '#3CA769' }} } onClick={() => navigate('/signup')}>Sign up</Typography>
                    </Typography>
                }
            />
        </Box>
    );
};

export default LoginPage;
