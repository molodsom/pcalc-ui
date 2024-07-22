import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Paper } from '@mui/material';

const Layout = ({ children }) => {
    const location = useLocation();
    const isIframeRoute = location.pathname.startsWith('/iframe/');

    return (
        <Container>
            {isIframeRoute ? children : <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>{children}</Paper>}
        </Container>
    );
};

export default Layout;
