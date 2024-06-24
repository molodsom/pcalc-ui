import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function PriceForm({ onSubmit }) {
    const [description, setDescription] = useState('');
    const [tag_name, setTagName] = useState('');
    const [price, setPrice] = useState('');
    const [order, setOrder] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            description,
            tag_name,
            price: parseFloat(price),
            order,
        });
        setDescription('');
        setTagName('');
        setPrice('');
        setOrder(0);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <TextField
                label="Tag Name"
                value={tag_name}
                onChange={(e) => setTagName(e.target.value)}
                required
            />
            <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <TextField
                label="Order"
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value))}
                required
            />
            <Button variant="contained" color="primary" type="submit">
                Add Price
            </Button>
        </Box>
    );
}

export default PriceForm;
