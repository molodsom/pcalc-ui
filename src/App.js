import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import VariablesPage from './pages/VariablesPage';
import PricesPage from './pages/PricesPage';
import CalculationPage from './components/CalculationPage';
import TemplateForm from './components/TemplateForm';
import IframeCalculationPage from './components/IframeCalculationPage';
import Layout from './components/Layout';
import AuthDialog from './components/AuthDialog';

function App() {
    const [authError, setAuthError] = useState(false);

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/iframe/:id" element={<IframeCalculationPage />} />
                <Route path="/calculator/:id" element={<CalculatorPage />} />
                <Route path="/calculator/:id/calculate" element={<CalculationPage />} />
                <Route path="/calculator/:id/variables" element={<VariablesPage />} />
                <Route path="/calculator/:id/prices" element={<PricesPage />} />
                <Route path="/calculator/:id/template" element={<TemplateForm />} />
            </Routes>
            <AuthDialog open={authError} onClose={() => setAuthError(false)} />
        </Layout>
    );
}

export default App;
