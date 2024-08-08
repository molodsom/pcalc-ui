import React, { useState, useEffect, useCallback } from 'react';
import {useParams} from 'react-router-dom';
import {Typography, Box} from '@mui/material';
import CalculatorMenu from "../components/CalculatorMenu";
import useAxios from "../api/useAxios";

function CalculatorPage() {
    const axios = useAxios();
    const { id } = useParams();
    const [calculator, setCalculator] = useState(null);

    const fetchCalculator = useCallback(async () => {
        const response = await axios.get(`/calculator/${id}`);
        setCalculator(response.data);
    }, [id]);

    useEffect(() => {
        fetchCalculator();
    }, [fetchCalculator]);

    if (!calculator) return <div>Loading...</div>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {calculator.name}
            </Typography>
            <CalculatorMenu calculatorId={id} />
        </Box>
    );
}

export default CalculatorPage;
