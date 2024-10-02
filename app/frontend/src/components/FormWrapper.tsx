import React from 'react';
import { Card } from '@nextui-org/react';

const FormWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f3f' }}>
        <Card style={{ width: '400px', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            {children}
        </Card>
    </div>
);

export default FormWrapper;
