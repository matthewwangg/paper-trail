import React from 'react';
import { Input } from '@nextui-org/react';

interface FormInputProps {
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({ type = "text", placeholder, value, onChange }) => (
    <Input
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        required
        style={{ marginBottom: '20px', padding: '10px', fontSize: '16px', width: '100%', boxSizing: 'border-box',  marginLeft: '0px' }}
    />
);

export default FormInput;
