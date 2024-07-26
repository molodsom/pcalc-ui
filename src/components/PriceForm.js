import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    IconButton,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Autocomplete,
    Chip,
    Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from '../api/axios';

const conditionOptions = [
    { value: '__gte', label: '>= (больше или равно)' },
    { value: '__gt', label: '> (больше)' },
    { value: '__lte', label: '<= (меньше или равно)' },
    { value: '__lt', label: '< (меньше)' },
    { value: '__eq', label: '= (равно)' },
    { value: '__ne', label: '!= (не равно)' },
    { value: '__in', label: 'in (в списке)' },
    { value: '', label: 'без условия' },
];

function PriceForm({ price = {}, calculatorId, onSave, onDelete, onCancel }) {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ ...price, extra: price.extra || {} });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleExtraChange = (key, value, condition) => {
        const newKey = condition ? `${key}${condition}` : key;
        setFormData((prev) => ({
            ...prev,
            extra: {
                ...prev.extra,
                [newKey]: value,
            },
        }));
    };

    const handleAddExtra = () => {
        setFormData((prev) => ({
            ...prev,
            extra: {
                ...prev.extra,
                '': '',
            },
        }));
    };

    const handleRemoveExtra = (key) => {
        const { [key]: _, ...newExtra } = formData.extra;
        setFormData((prev) => ({
            ...prev,
            extra: newExtra,
        }));
    };

    const handleSave = async () => {
        const tagRegex = /^[a-zA-Z][a-zA-Z_0-9]*$/;
        if (!tagRegex.test(formData.tag_name)) {
            setError('Tag name must start with a letter and contain only letters, numbers, and underscores.');
            return;
        }
        setError('');

        try {
            if (price._id) {
                await axios.patch(`/calculator/${calculatorId}/price/${price._id}`, formData);
            } else {
                await axios.post(`/calculator/${calculatorId}/price`, formData);
            }
            onSave(formData);
        } catch (err) {
            console.error('Error saving price:', err);
            setError('Error saving price. Please try again.');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    label="Описание"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    size="small"
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Название переменной"
                    name="tag_name"
                    value={formData.tag_name}
                    onChange={handleChange}
                    size="small"
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Цена"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    size="small"
                    sx={{ flex: 1 }}
                />
            </Box>
            <Typography variant="h6">Дополнительные свойства</Typography>
            {Object.keys(formData.extra).map((key, index) => {
                const match = key.match(/(.*?)(__(gte|gt|lte|lt|eq|ne|in))?$/);
                const field = match ? match[1] : key;
                const condition = match && match[2] ? match[2] : '';

                return (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Ключ"
                            value={field}
                            onChange={(e) => {
                                const newField = e.target.value;
                                const value = formData.extra[key];
                                handleRemoveExtra(key);
                                handleExtraChange(newField, value, condition);
                            }}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <FormControl size="small" sx={{ flex: 1 }}>
                            <InputLabel>Условие</InputLabel>
                            <Select
                                label="Условие"
                                value={condition || ''}
                                onChange={(e) => {
                                    const newCondition = e.target.value;
                                    const value = formData.extra[key];
                                    handleRemoveExtra(key);
                                    handleExtraChange(field, value, newCondition);
                                }}
                            >
                                {conditionOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {condition === '__in' ? (
                            <Autocomplete
                                multiple
                                freeSolo
                                options={[]}
                                value={Array.isArray(formData.extra[key]) ? formData.extra[key] : []}
                                onChange={(event, newValue) => handleExtraChange(field, newValue, condition)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                key={key}  // передача ключа напрямую
                                                variant="outlined"
                                                label={option}
                                                {...tagProps}
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="Значения"
                                        size="small"
                                        sx={{ flex: 1 }}
                                    />
                                )}
                                sx={{ flex: 1 }}
                            />

                        ) : (
                            <TextField
                                label="Значение"
                                value={formData.extra[key]}
                                onChange={(e) => handleExtraChange(field, e.target.value, condition)}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                        )}
                        <IconButton onClick={() => handleRemoveExtra(key)}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                );
            })}
            <Button onClick={handleAddExtra} size="small" startIcon={<AddIcon />}>
                Добавить дополнительное свойство
            </Button>
            <Grid container spacing={2} columns={16} justifyContent="space-between">
                {onDelete && (
                    <Grid item>
                        <Button onClick={() => onDelete(price._id)} size="small">
                            Удалить
                        </Button>
                    </Grid>
                )}
                <Grid item>
                    <Button onClick={onCancel} size="small">
                        Отменить
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleSave} size="small">
                        Сохранить
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default PriceForm;
