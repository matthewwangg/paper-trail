import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import FormWrapper from '../components/FormWrapper';
import PageHeader from "../components/PageHeader";
import { Spacer } from '@nextui-org/react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = 'http://localhost:8080';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/notes');
        } catch (error) {
            alert('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormWrapper>
            <PageHeader title="Login" />
            <form onSubmit={handleLogin}>
                <FormInput placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Spacer y={1} />
                <FormInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Spacer y={1.5} />
                <SubmitButton isLoading={loading} label="Signup" />
            </form>
        </FormWrapper>
    );
};

export default LoginPage;
