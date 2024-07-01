import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import VariablesPage from './pages/VariablesPage';
import PricesPage from './pages/PricesPage';
import { Container } from '@mui/material';
import CalculationPage from "./components/CalculationPage";
import TemplateForm from "./components/TemplateForm";

function App() {
    return (
        <Container>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/calculator/:id" element={<CalculatorPage />} />
                <Route path="/calculator/:id/calculate" element={<CalculationPage />} />
                <Route path="/calculator/:id/variables" element={<VariablesPage />} />
                <Route path="/calculator/:id/prices" element={<PricesPage />} />
                <Route path="/calculator/:id/template" element={<TemplateForm />} />
            </Routes>
        </Container>
    );
}

export default App;
