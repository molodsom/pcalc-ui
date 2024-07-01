import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { useParams } from 'react-router-dom';

function VariableForm({ onSubmit }) {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [tag_name, setTagName] = useState('');
    const [description, setDescription] = useState('');
    const [data_type, setDataType] = useState('str');
    const [default_value, setDefaultValue] = useState('');
    const [formula, setFormula] = useState('');
    const [widget, setWidget] = useState('text');
    const [required, setRequired] = useState(false);
    const [is_output, setIsOutput] = useState(false);
    const [error, setError] = useState('');
    const [formulaError, setFormulaError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagRegex = /^[a-zA-Z][a-zA-Z_0-9]*$/;
        if (!tagRegex.test(tag_name)) {
            setError('Имя переменной должно начинаться с буквы и содержать только буквы, цифры и символы подчеркивания.');
            return;
        }
        setError('');
        try {
            await onSubmit({
                name,
                tag_name,
                description,
                data_type,
                default_value,
                formula,
                widget,
                required,
                is_output,
                calculator_id: id
            });
            setName('');
            setTagName('');
            setDescription('');
            setDataType('str');
            setDefaultValue('');
            setFormula('');
            setWidget('text');
            setRequired(false);
            setIsOutput(false);
            setFormulaError('');
        } catch (error) {
            if (error.response && error.response.data.detail) {
                setFormulaError(error.response.data.detail);
            }
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 2 }}>
            <TextField
                label="Имя переменной"
                value={tag_name}
                onChange={(e) => setTagName(e.target.value)}
                required
                size="small"
                error={Boolean(error)}
                helperText={error}
            />
            <TextField
                label="Описание"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                size="small"
            />
            <FormControl size="small">
                <InputLabel>Тип данных</InputLabel>
                <Select
                    label="Тип данных"
                    value={data_type}
                    onChange={(e) => setDataType(e.target.value)}
                >
                    <MenuItem value="str">Строка</MenuItem>
                    <MenuItem value="int">Целое число</MenuItem>
                    <MenuItem value="float">Дробное число</MenuItem>
                    <MenuItem value="bool">Логическое значение</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Значение по умолчанию"
                value={default_value}
                onChange={(e) => setDefaultValue(e.target.value)}
                size="small"
            />
            <TextField
                label="Формула"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                size="small"
                error={Boolean(formulaError)}
                helperText={formulaError}
            />
            <FormControl size="small">
                <InputLabel>Виджет</InputLabel>
                <Select
                    label="Виджет"
                    value={widget}
                    onChange={(e) => setWidget(e.target.value)}
                >
                    <MenuItem value="text">Текст</MenuItem>
                    <MenuItem value="textarea">Текстовая область</MenuItem>
                    <MenuItem value="number">Ввод числа</MenuItem>
                    <MenuItem value="dropdown">Выбор из списка</MenuItem>
                    <MenuItem value="checkbox">Чекбокс</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel
                control={<Checkbox checked={required} onChange={(e) => setRequired(e.target.checked)} />}
                label="Обязательное"
            />
            <FormControlLabel
                control={<Checkbox checked={is_output} onChange={(e) => setIsOutput(e.target.checked)} />}
                label="Вывод"
            />
            <Button variant="contained" color="primary" type="submit">
                Добавить переменную
            </Button>
        </Box>
    );
}

export default VariableForm;
