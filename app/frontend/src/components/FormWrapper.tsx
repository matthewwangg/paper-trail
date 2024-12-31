import React from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import FormInput from './FormInput';

const FormWrapper: React.FC<{
    title: string;
    fields: { placeholder: string; value: string; onChange: (value: string) => void; type?: string }[];
    onSubmit: () => void;
    buttonLabel: string;
    loading: boolean;
    errorMessage?: string;
    additionalContent?: React.ReactNode;
}> = ({ title, fields, onSubmit, buttonLabel, loading, errorMessage, additionalContent }) => (
    <Container maxWidth="xs" sx={{ backgroundColor: '#1E293B', padding: 4, borderRadius: 2, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)' }}>
        <Typography variant="h4" gutterBottom color="white">{title}</Typography>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            {fields.map((field, i) => (
                <FormInput key={i} {...field} />
            ))}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#4ADE80', '&:hover': { backgroundColor: '#3CA769' } }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : buttonLabel}
            </Button>
        </form>
        {errorMessage && <Typography color="#DC2626" sx={{ mt: 2 }}>{errorMessage}</Typography>}
        {additionalContent}
    </Container>
);

export default FormWrapper;