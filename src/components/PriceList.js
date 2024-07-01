import React, { useState } from 'react';
import { TextField, Button, Box, IconButton, Typography } from '@mui/material';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from './ConfirmationDialog';

function PriceList({ price, onSave, onDelete }) {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...price, extra: price.extra || {} });
    const [open, setOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleExtraChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            extra: {
                ...prev.extra,
                [key]: value,
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
        await axios.patch(`/calculator/${id}/price/${price._id}`, formData);
        setIsEditing(false);
        onSave(formData);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        await axios.delete(`/calculator/${id}/price/${price._id}`);
        onDelete(price._id);
        handleClose();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Tag Name"
                            name="tag_name"
                            value={formData.tag_name}
                            onChange={handleChange}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                        <TextField
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            size="small"
                            sx={{ flex: 1 }}
                        />
                    </Box>
                    <Typography variant="h6">Extra Fields</Typography>
                    {Object.keys(formData.extra).map((key, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                label="Key"
                                value={key}
                                onChange={(e) => {
                                    const newKey = e.target.value;
                                    const value = formData.extra[key];
                                    handleRemoveExtra(key);
                                    handleExtraChange(newKey, value);
                                }}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Value"
                                value={formData.extra[key]}
                                onChange={(e) => handleExtraChange(key, e.target.value)}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                            <IconButton onClick={() => handleRemoveExtra(key)}>
                                <RemoveIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button onClick={handleAddExtra} size="small" startIcon={<AddIcon />}>
                        Add Extra Field
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSave} size="small" sx={{ flex: 1 }}>
                            Save
                        </Button>
                        <IconButton onClick={handleClickOpen} size="small" sx={{ flex: 1 }}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>{price.description}</Box>
                    <Box sx={{ flex: 1 }}>{price.tag_name}</Box>
                    <Box sx={{ flex: 1 }}>{price.price}</Box>
                    <Box sx={{ flex: 1 }}>{JSON.stringify(price.extra)}</Box>
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
                content="Точно хотите удалить цену?"
            />
        </Box>
    );
}

export default PriceList;
