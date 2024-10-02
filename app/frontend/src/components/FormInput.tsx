import { Input } from '@nextui-org/react';

interface FormInputProps {
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ type = "text", placeholder, value, onChange, required = true }) => {
    return (
        <Input
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
            fullWidth
            required={required}
        />
    );
};

export default FormInput;
