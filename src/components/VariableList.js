import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

function VariableList({ variable, onSave }) {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...variable });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const tagRegex = /^[a-zA-Z][a-zA-Z_0-9]*$/;
        if (!tagRegex.test(formData.tag_name)) {
            setError('Tag name must start with a letter and contain only letters, numbers, and underscores.');
            return;
        }
        setError('');
        await axios.patch(`/calculator/${id}/variable/${variable._id}`, formData);
        setIsEditing(false);
        onSave(formData);  // Обновление значений в родительском компоненте
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isEditing ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        size="small"
                    />
                    <TextField
                        label="Tag Name"
                        name="tag_name"
                        value={formData.tag_name}
                        onChange={handleChange}
                        size="small"
                        error={Boolean(error)}
                        helperText={error}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        size="small"
                    />
                    <FormControl size="small">
                        <InputLabel>Data Type</InputLabel>
                        <Select
                            label="Data Type"
                            name="data_type"
                            value={formData.data_type}
                            onChange={handleChange}
                        >
                            <MenuItem value="str">String</MenuItem>
                            <MenuItem value="int">Integer</MenuItem>
                            <MenuItem value="float">Float</MenuItem>
                            <MenuItem value="bool">Boolean</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Default Value"
                        name="default_value"
                        value={formData.default_value}
                        onChange={handleChange}
                        size="small"
                    />
                    <Button variant="contained" color="primary" onClick={handleSave} size="small">
                        Save
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box>{variable.name}</Box>
                    <Box>{variable.tag_name}</Box>
                    <Box>{variable.description}</Box>
                    <Box>{variable.data_type}</Box>
                    <Box>{variable.default_value}</Box>
                    <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} size="small">
                        Edit
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default VariableList;
