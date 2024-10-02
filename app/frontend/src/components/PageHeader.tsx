import React from 'react';

const PageHeader: React.FC<{ title: string }> = ({ title }) => (
    <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '30px', fontWeight: '700', color: '#333', width: '100%' }}>
        {title}
    </h1>
);

export default PageHeader;
