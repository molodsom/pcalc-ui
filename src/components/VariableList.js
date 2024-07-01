import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from './ConfirmationDialog';

function VariableList({ variable, onSave, onDelete }) {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...variable });
    const [error, setError] = useState('');
    const [formulaError, setFormulaError] = useState('');
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async () => {
        const tagRegex = /^[a-zA-Z][a-zA-Z_0-9]*$/;
        if (!tagRegex.test(formData.tag_name)) {
            setError('Tag name must start with a letter and contain only letters, numbers, and underscores.');
            return;
        }
        setError('');
        try {
            const response = await axios.patch(`/calculator/${id}/variable/${variable._id}`, {
                ...formData,
                calculator_id: id
            });
            if (response.status === 200) {
                onSave(formData);
                setIsEditing(false);
                setFormulaError('');
            }
        } catch (error) {
            if (error.response && error.response.data.detail) {
                setFormulaError(error.response.data.detail);
            }
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        await axios.delete(`/calculator/${id}/variable/${variable._id}`);
        onDelete(variable._id);
        handleClose();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
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
                                label="Виджет"
                                name="widget"
                                value={formData.widget}
                                onChange={handleChange}
                            >
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
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSave} size="small" sx={{ flex: 1 }}>
                            Сохранить
                        </Button>
                        <IconButton onClick={handleClickOpen} size="small" sx={{ flex: 1 }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>{variable.name}</Box>
                    <Box sx={{ flex: 1 }}>{variable.tag_name}</Box>
                    <Box sx={{ flex: 1 }}>{variable.description}</Box>
                    <Box sx={{ flex: 1 }}>{variable.data_type}</Box>
                    <Box sx={{ flex: 1 }}>{variable.default_value}</Box>
                    <Box sx={{ flex: 1 }}>{variable.formula}</Box>
                    <Box sx={{ flex: 1 }}>{variable.widget}</Box>
                    <Box sx={{ flex: 1 }}>{variable.required ? 'Обязательное' : 'Не обязательное'}</Box>
                    <Box sx={{ flex: 1 }}>{variable.is_output ? 'Вывод' : ''}</Box>
                    <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} size="small" sx={{ flex: 1 }}>
                        Edit
                    </Button>
                    <IconButton onClick={handleClickOpen} size="small" sx={{ flex: 1 }}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            <ConfirmationDialog
                open={open}
                handleClose={handleClose}
                handleConfirm={handleDelete}
                title="Подтверждение"
                content="Вы точно хотите удалить переменную?"
            />
        </Box>
    );
}

export default VariableList;
