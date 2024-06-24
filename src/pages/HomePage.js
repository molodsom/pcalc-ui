import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import CalculatorList from '../components/CalculatorList';
import CalculatorForm from '../components/CalculatorForm';
import { Typography, Box } from '@mui/material';

function HomePage() {
    const [calculators, setCalculators] = useState([]);

    useEffect(() => {
        fetchCalculators();
    }, []);

    const fetchCalculators = async () => {
        const response = await axios.get('/calculator');
        setCalculators(response.data);
    };

    const createCalculator = async (name) => {
        await axios.post('/calculator', { name });
        fetchCalculators();
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Calculators
            </Typography>
            <CalculatorForm onSubmit={createCalculator} />
            <CalculatorList calculators={calculators} />
        </Box>
    );
}

export default HomePage;
