import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VariableForm from './VariableForm';
import ConfirmationDialog from './ConfirmationDialog';

function VariableList({ variable, onSave, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSave = async (formData) => {
        await onSave({ ...formData, _id: variable._id }); // Ensure _id is included for update
        setIsEditing(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        await onDelete(variable._id);
        handleClose();
    };

    const displayValue = (value) => {
        return [null, undefined].includes(value) ? '' : `${value}`;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isEditing ? (
                <VariableForm
                    calculatorId={variable.calculator_id}
                    variable={variable}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>{variable.name}</Box>
                    <Box sx={{ flex: 1 }}><strong>{variable.tag_name}{variable.required ? '*' : ''}</strong></Box>
                    <Box sx={{ flex: 1 }}>{variable.description}</Box>
                    <Box sx={{ flex: 1 }}>{variable.data_type}</Box>
                    <Box sx={{ flex: 1 }}>{displayValue(variable.default_value)}</Box>
                    <Box sx={{ flex: 1 }}>{variable.formula}</Box>
                    <Box sx={{ flex: 1 }}>{variable.widget}</Box>
                    <Box sx={{ flex: 1 }}>{variable.is_output ? 'Вывод' : ''}</Box>
                    <IconButton onClick={() => setIsEditing(true)} size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleClickOpen} size="small">
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
