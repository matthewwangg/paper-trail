import React from 'react';
import { TextField } from '@mui/material';

const FormInput: React.FC<{
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}> = ({ placeholder, value, onChange, type = 'text' }) => (
    <TextField
        fullWidth
        margin="normal"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
            '& .MuiInputBase-input': {
                color: '#E0F2F1',
                backgroundColor: '#2D3748',
                borderRadius: '6px',
                padding: '10px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#4ADE80' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3CA769' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3CA769' }
        }}
    />
);

export default FormInput;