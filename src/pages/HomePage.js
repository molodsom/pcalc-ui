import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import CalculatorList from '../components/CalculatorList';
import CalculatorForm from '../components/CalculatorForm';
import { Typography, Box, Paper, Container, Button } from '@mui/material';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from "@mui/icons-material/Add";

function HomePage() {
    const [calculators, setCalculators] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

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
        setIsAdding(false);
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Калькуляторы
            </Typography>
            <CalculatorList calculators={calculators} />
            <Box mt={2}>
                {isAdding ? (
                    <CalculatorForm onSubmit={createCalculator} />
                ) : (
                    <Button startIcon={<AddIcon />} variant="contained" color="primary" onClick={() => setIsAdding(true)}>
                        Добавить
                    </Button>
                )}
            </Box>
        </Container>
    );
}

export default HomePage;