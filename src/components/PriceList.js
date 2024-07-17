import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PriceForm from './PriceForm';

function PriceList({ price, onSave, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async (formData) => {
        await onSave(formData);
        setIsEditing(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isEditing ? (
                <PriceForm
                    calculatorId={price.calculator_id}
                    price={price}
                    onSave={handleSave}
                    onDelete={onDelete}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ flex: 1 }}>{price.description}</Box>
                    <Box sx={{ flex: 1 }}>{price.tag_name}</Box>
                    <Box sx={{ flex: 1 }}>{price.price}</Box>
                    <Box sx={{ flex: 1 }}>{JSON.stringify(price.extra)}</Box>
                    <IconButton onClick={() => setIsEditing(true)} size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(price._id)} size="small">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}

export default PriceList;
