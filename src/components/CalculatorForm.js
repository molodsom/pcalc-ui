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
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
            <TextField
                label="Calculator Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <Button variant="contained" color="primary" type="submit">
                Add Calculator
            </Button>
        </Box>
    );
}

export default CalculatorForm;
