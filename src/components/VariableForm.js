import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    FormControlLabel,
    Grid,
    Autocomplete,
    Chip
} from '@mui/material';

const VariableForm = ({ variable = {}, calculatorId, onSave, onDelete, onCancel }) => {
    const initialFormState = {
        tag_name: '',
        name: '',
        data_type: 'str',
        default_value: '',
        widget: '',
        required: false,
        is_output: false,
        formula: '',
        choices: [],
        order: variable.order || 0
    };

    const [formData, setFormData] = useState(initialFormState);
    const [error, setError] = useState('');
    const [formulaError, setFormulaError] = useState('');

    useEffect(() => {
        if (variable && variable._id) {
            setFormData({
                tag_name: variable.tag_name || '',
                name: variable.name || '',
                data_type: variable.data_type || 'str',
                default_value: variable.default_value || '',
                widget: variable.widget || '',
                required: variable.required || false,
                is_output: variable.is_output || false,
                formula: variable.formula || '',
                choices: variable.choices || [],
                order: variable.order || 0
            });
        } else {
            setFormData(initialFormState);
        }
    }, [variable]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleChoicesChange = (event, newValue) => {
        setFormData((prev) => ({ ...prev, choices: newValue }));
    };

    const handleSave = async (event) => {
        event.preventDefault();
        const tagRegex = /^[a-zA-Z][a-zA-Z_0-9]*$/;
        if (!tagRegex.test(formData.tag_name)) {
            setError('Tag name must start with a letter and contain only letters, numbers, and underscores.');
            return;
        }
        setError('');
        try {
            await onSave({
                ...formData,
                name: formData.name || '',
                tag_name: formData.tag_name || '',
            });
            setFormulaError('');
        } catch (error) {
            if (error.response && error.response.data.detail) {
                setFormulaError(error.response.data.detail);
            } else {
                console.error("Unexpected error:", error);
                setFormulaError("An unexpected error occurred.");
            }
        }
    };

    return (
        <form onSubmit={handleSave}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        required
                        label="Имя переменной"
                        name="tag_name"
                        value={formData.tag_name}
                        onChange={handleChange}
                        size="small"
                        error={Boolean(error)}
                        helperText={error}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Описание"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        size="small"
                        sx={{ flex: 1 }}
                    />
                    <FormControl size="small" sx={{ flex: 1 }}>
                        <InputLabel>Тип данных</InputLabel>
                        <Select
                            required
                            label="Тип данных"
                            name="data_type"
                            value={formData.data_type}
                            onChange={handleChange}
                        >
                            <MenuItem value="str">Строка</MenuItem>
                            <MenuItem value="int">Целое число</MenuItem>
                            <MenuItem value="float">Дробное число</MenuItem>
                            <MenuItem value="bool">Логическое значение</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="По умолчанию"
                        name="default_value"
                        value={formData.default_value}
                        onChange={handleChange}
                        size="small"
                        sx={{ flex: 1 }}
                    />
                    <FormControl size="small" sx={{ flex: 1 }}>
                        <InputLabel>Виджет</InputLabel>
                        <Select
                            label="Не показывать"
                            name="widget"
                            value={formData.widget || ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="">Не показывать</MenuItem>
                            <MenuItem value="text">Текст</MenuItem>
                            <MenuItem value="textarea">Текстовая область</MenuItem>
                            <MenuItem value="number">Ввод числа</MenuItem>
                            <MenuItem value="dropdown">Выбор из списка</MenuItem>
                            <MenuItem value="checkbox">Чекбокс</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox checked={formData.required} onChange={handleChange} name="required" />}
                        label="Обязательное"
                        sx={{ flex: 1 }}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={formData.is_output} onChange={handleChange} name="is_output" />}
                        label="Вывод"
                        sx={{ flex: 1 }}
                    />
                </Box>
                {formData.widget === 'dropdown' && (
                    <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={formData.choices}
                        onChange={handleChoicesChange}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Варианты"
                                size="small"
                                sx={{ flex: 1 }}
                            />
                        )}
                        sx={{ flex: 1 }}
                    />
                )}
                <TextField
                    label="Формула"
                    name="formula"
                    value={formData.formula}
                    onChange={handleChange}
                    size="small"
                    error={Boolean(formulaError)}
                    helperText={formulaError}
                    sx={{ flex: 1 }}
                />
                <Grid container spacing={2} columns={16} justifyContent="space-between">
                    {onDelete && (
                        <Grid item>
                            <Button onClick={() => onDelete(variable._id)} size="small">
                                Удалить
                            </Button>
                        </Grid>
                    )}
                    {variable._id && (
                        <Grid item>
                            <Button onClick={onCancel} size="small">
                                Отменить
                            </Button>
                        </Grid>
                    )}
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary" size="small">
                            Сохранить
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </form>
    );
};

export default VariableForm;
