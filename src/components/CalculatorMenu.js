import React from 'react';
import {Button, Box} from '@mui/material';
import {ChevronLeft} from "@mui/icons-material";

function CalculatorMenu({ calculatorId }) {
    return (
        <Box>
            <Button href={`/`}><ChevronLeft /></Button>
            <Button href={`/calculator/${calculatorId}/variables`}>Переменные</Button>
            <Button href={`/calculator/${calculatorId}/prices`}>Цены</Button>
            <Button href={`/calculator/${calculatorId}/calculate`}>Расчёт</Button>
        </Box>
    );
}

export default CalculatorMenu;
