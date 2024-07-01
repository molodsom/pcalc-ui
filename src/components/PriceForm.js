import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function PriceForm({ onSubmit }) {
    const [description, setDescription] = useState('');
    const [tag_name, setTagName] = useState('');
    const [price, setPrice] = useState('');
    const [extra, setExtra] = useState({});

    const handleExtraChange = (key, value) => {
        setExtra((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleAddExtra = () => {
        setExtra((prev) => ({
            ...prev,
            '': '',
        }));
    };

    const handleRemoveExtra = (key) => {
        const { [key]: _, ...newExtra } = extra;
        setExtra(newExtra);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            description,
            tag_name,
            price: parseFloat(price),
            extra,
            order: 0,
        });
        setDescription('');
        setTagName('');
        setPrice('');
        setExtra({});
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    label="Имя переменной"
                    value={tag_name}
                    onChange={(e) => setTagName(e.target.value)}
                    required
                    size="small"
                />
                <TextField
                    label="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    size="small"
                />
                <TextField
                    label="Цена"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    size="small"
                />
            </Box>
            <Box>
                {Object.keys(extra).map((key, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Ключ"
                            value={key}
                            onChange={(e) => {
                                const newKey = e.target.value;
                                const value = extra[key];
                                handleRemoveExtra(key);
                                handleExtraChange(newKey, value);
                            }}
                            size="small"
                        />
                        <TextField
                            label="Значение"
                            value={extra[key]}
                            onChange={(e) => handleExtraChange(key, e.target.value)}
                            size="small"
                        />
                        <Button onClick={() => handleRemoveExtra(key)} size="small">
                            Удалить
                        </Button>
                    </Box>
                ))}
                <Button onClick={handleAddExtra} size="small">
                    Добавить доп. свойство
                </Button>
            </Box>
            <Button variant="contained" color="primary" type="submit">
                Добавить цену
            </Button>
        </Box>
    );
}

export default PriceForm;
