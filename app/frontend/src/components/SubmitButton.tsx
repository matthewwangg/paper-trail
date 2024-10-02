import React from 'react';
import { Button } from '@nextui-org/react';

interface SubmitButtonProps {
    isLoading: boolean;
    label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, label }) => (
    <Button
        type="submit"
        color="primary"
        disabled={isLoading}
        style={{ width: '100%', fontWeight: '600', padding: '10px', fontSize: '16px', backgroundColor: '#0066cc', boxSizing: 'border-box', marginLeft: '0px' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
    >
        {isLoading ? 'Processing...' : label}
    </Button>
);

export default SubmitButton;
