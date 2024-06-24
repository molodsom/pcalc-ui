import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

function PriceList({ price, onSave }) {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...price });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await axios.patch(`/calculator/${id}/price/${price._id}`, formData);
        setIsEditing(false);
        onSave(formData);  // Обновление значений в родительском компоненте
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isEditing ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        size="small"
                    />
                    <TextField
                        label="Tag Name"
                        name="tag_name"
                        value={formData.tag_name}
                        onChange={handleChange}
                        size="small"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        size="small"
                    />
                    <Button variant="contained" color="primary" onClick={handleSave} size="small">
                        Save
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box>{price.description}</Box>
                    <Box>{price.tag_name}</Box>
                    <Box>{price.price}</Box>
                    <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} size="small">
                        Edit
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default PriceList;
