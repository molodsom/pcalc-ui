import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function VariableForm({ onSubmit }) {
    const [name, setName] = useState('');
    const [tag_name, setTagName] = useState('');
    const [description, setDescription] = useState('');
    const [data_type, setDataType] = useState('str');
    const [default_value, setDefaultValue] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagRegex = /^[a-zA-Z][a-zA-Z_0-9]*$/;
        if (!tagRegex.test(tag_name)) {
            setError('Tag name must start with a letter and contain only letters, numbers, and underscores.');
            return;
        }
        setError('');
        onSubmit({
            name,
            tag_name,
            description,
            data_type,
            default_value,
            order: 0, // скрытое поле order, значение по умолчанию
        });
        setName('');
        setTagName('');
        setDescription('');
        setDataType('str');
        setDefaultValue('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 2 }}>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                size="small"
            />
            <TextField
                label="Tag Name"
                value={tag_name}
                onChange={(e) => setTagName(e.target.value)}
                required
                size="small"
                error={Boolean(error)}
                helperText={error}
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="small"
            />
            <FormControl size="small">
                <InputLabel>Data Type</InputLabel>
                <Select
                    label="Data Type"
                    value={data_type}
                    onChange={(e) => setDataType(e.target.value)}
                >
                    <MenuItem value="str">String</MenuItem>
                    <MenuItem value="int">Integer</MenuItem>
                    <MenuItem value="float">Float</MenuItem>
                    <MenuItem value="bool">Boolean</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Default Value"
                value={default_value}
                onChange={(e) => setDefaultValue(e.target.value)}
                size="small"
            />
            <Button variant="contained" color="primary" type="submit">
                Add Variable
            </Button>
        </Box>
    );
}

export default VariableForm;
