import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import FormWrapper from '../components/FormWrapper';
import PageHeader from "../components/PageHeader";
import { Spacer } from '@nextui-org/react';

const SignupPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = 'http://localhost:8080';

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username,
                password,
            });
            alert('Registration successful. Please login.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormWrapper>
            <PageHeader title="Signup" />
            <form onSubmit={handleSignup}>
                <FormInput placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <Spacer y={1} />
                <FormInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Spacer y={1.5} />
                <SubmitButton isLoading={loading} label="Signup" />
            </form>
        </FormWrapper>
    );
};

export default SignupPage;
