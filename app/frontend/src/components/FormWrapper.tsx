import React from 'react';
import { Card, Spacer } from '@nextui-org/react';

interface FormWrapperProps {
    children: React.ReactNode;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ children }) => {
    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card style={{ maxWidth: '400px', padding: '40px' }}>
                {children}
            </Card>
        </div>
    );
};

export default FormWrapper;
