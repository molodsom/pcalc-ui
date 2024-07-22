import React, { useState } from 'react';
import {Box, IconButton, Typography} from '@mui/material';
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
                    <Box sx={{ flex: 1 }}>
                        <Box>{price.description}</Box>
                        <Box><Typography variant={"caption"}>{price.tag_name}</Typography></Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>{JSON.stringify(price.extra)}</Box>
                    <Box sx={{ flex: 1, textAlign: "center" }}>{price.price}</Box>
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
