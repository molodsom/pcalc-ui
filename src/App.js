import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import VariablesPage from './pages/VariablesPage';
import PricesPage from './pages/PricesPage';
import { Container } from '@mui/material';

function App() {
    return (
        <Container>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/calculator/:id" element={<CalculatorPage />} />
                <Route path="/calculator/:id/variables" element={<VariablesPage />} />
                <Route path="/calculator/:id/prices" element={<PricesPage />} />
            </Routes>
        </Container>
    );
}

export default App;
