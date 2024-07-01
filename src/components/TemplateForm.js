import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

function TemplateForm() {
    const { id } = useParams();
    const [html, setHtml] = useState('');
    const [templateId, setTemplateId] = useState(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await axios.get(`/calculator/${id}/template`);
                setHtml(response.data.html);
                setTemplateId(response.data._id);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    console.error("Failed to fetch template", error);
                }
            }
        };
        fetchTemplate();
    }, [id]);

    const handleSave = async () => {
        if (templateId) {
            await axios.put(`/calculator/${id}/template`, { calculator_id: id, html });
        } else {
            await axios.post(`/calculator/${id}/template`, { calculator_id: id, html });
        }
    };

    const handleDelete = async () => {
        if (templateId) {
            await axios.delete(`/calculator/${id}/template`);
            setHtml('');
            setTemplateId(null);
        }
    };

    return (
        <Box>
            <Typography variant="h5">Edit HTML Template</Typography>
            <TextField
                label="HTML Template"
                multiline
                rows={10}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                variant="outlined"
                fullWidth
            />
            <Box sx={{ marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                {templateId && (
                    <Button variant="contained" color="secondary" onClick={handleDelete} sx={{ marginLeft: 2 }}>
                        Delete
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default TemplateForm;
