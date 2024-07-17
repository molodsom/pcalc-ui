import React from 'react';
import {Box, Button, ButtonGroup} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CodeIcon from '@mui/icons-material/Code';
import ListIcon from '@mui/icons-material/List';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalculateIcon from '@mui/icons-material/Calculate';

function CalculatorMenu({ calculatorId }) {
    return (
        <Box mb={2}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button href={`/`} startIcon={<ChevronLeftIcon />}>
                    Назад
                </Button>
                <Button href={`/calculator/${calculatorId}/template`} startIcon={<CodeIcon />}>
                    Шаблон
                </Button>
                <Button href={`/calculator/${calculatorId}/variables`} startIcon={<ListIcon />}>
                    Переменные
                </Button>
                <Button href={`/calculator/${calculatorId}/prices`} startIcon={<AttachMoneyIcon />}>
                    Цены
                </Button>
                <Button href={`/calculator/${calculatorId}/calculate`} startIcon={<CalculateIcon />}>
                    Расчёт
                </Button>
            </ButtonGroup>
        </Box>
    );
}

export default CalculatorMenu;
