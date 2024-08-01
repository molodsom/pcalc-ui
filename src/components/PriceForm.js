import React, { useState, useEffect } from 'react';
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

const numericConditions = ['__gte', '__gt', '__lte', '__lt'];

function PriceForm({ price = {}, calculatorId, onSave, onDelete, onCancel }) {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        ...price,
        extra: price.extra ? Object.entries(price.extra).map(([key, value]) => ({ key, value })) : [],
        description: price.description || '',
        tag_name: price.tag_name || '',
        price: price.price || '',
    });

    useEffect(() => {
        if (price && price.extra) {
            setFormData({
                ...price,
                extra: Object.entries(price.extra).map(([key, value]) => ({ key, value })),
                description: price.description || '',
                tag_name: price.tag_name || '',
                price: price.price || '',
            });
        }
    }, [price]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleExtraChange = (index, key, value, condition) => {
        const newExtra = [...formData.extra];
        const newKey = condition ? `${key}${condition}` : key;
        const parsedValue = numericConditions.includes(condition) ? Number(value) : value;
        newExtra[index] = { key: newKey, value: parsedValue };
        setFormData((prev) => ({
            ...prev,
            extra: newExtra,
        }));
    };

    const handleAddExtra = () => {
        setFormData((prev) => ({
            ...prev,
            extra: [...prev.extra, { key: '', value: '' }],
        }));
    };

    const handleRemoveExtra = (index) => {
        const newExtra = formData.extra.filter((_, i) => i !== index);
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

        const extraObject = formData.extra.reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {});

        const formDataToSend = { ...formData, extra: extraObject };

        onSave(formDataToSend);
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
            {formData.extra.map((extraItem, index) => {
                const match = extraItem.key.match(/(.*?)(__(gte|gt|lte|lt|eq|ne|in))?$/);
                const field = match ? match[1] : extraItem.key;
                const condition = match && match[2] ? match[2] : '';

                return (
                    <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Ключ"
                            value={field}
                            onChange={(e) => {
                                const newField = e.target.value;
                                const value = extraItem.value;
                                handleExtraChange(index, newField, value, condition);
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
                                    const value = extraItem.value;
                                    handleExtraChange(index, field, value, newCondition);
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
                                value={Array.isArray(extraItem.value) ? extraItem.value : []}
                                onChange={(event, newValue) => handleExtraChange(index, field, newValue, condition)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            key={index}
                                            variant="outlined"
                                            label={option}
                                            {...getTagProps({ index })}
                                        />
                                    ))
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
                                value={extraItem.value}
                                onChange={(e) => handleExtraChange(index, field, e.target.value, condition)}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                        )}
                        <IconButton onClick={() => handleRemoveExtra(index)}>
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
