import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function CalculatorForm({ onSubmit }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(name);
        setName('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
            <TextField
                label="Имя калькулятора"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
                Сохранить
            </Button>
        </Box>
    );
}

export default CalculatorForm;