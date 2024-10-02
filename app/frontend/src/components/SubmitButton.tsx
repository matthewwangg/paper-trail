import { Button } from '@nextui-org/react';

interface SubmitButtonProps {
    isLoading: boolean;
    label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, label }) => {
    return (
        <Button type="submit" color="primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : label}
        </Button>
    );
};

export default SubmitButton;
