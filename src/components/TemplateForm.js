import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Tooltip,
    Chip
} from '@mui/material';
import CalculatorMenu from "./CalculatorMenu";
import SaveIcon from "@mui/icons-material/Save";
import useAxios from "../api/useAxios";

function TemplateForm() {
    const axios = useAxios();
    const { id } = useParams();
    const [html, setHtml] = useState('');
    const [templateId, setTemplateId] = useState(null);
    const [variables, setVariables] = useState([]);
    const [copySuccess, setCopySuccess] = useState('');

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

        const fetchVariables = async () => {
            try {
                const response = await axios.get(`/calculator/${id}/variable`);
                setVariables(response.data);
            } catch (error) {
                console.error("Failed to fetch variables", error);
            }
        };

        fetchTemplate().then(_ => {});
        fetchVariables().then(_ => {});
    }, [id]);

    const handleSave = async () => {
        try {
            if (templateId) {
                await axios.put(`/calculator/${id}/template`, { html });
            } else {
                await axios.post(`/calculator/${id}/template`, { calculator_id: id, html });
            }
            alert('Template saved successfully');
        } catch (error) {
            console.error("Failed to save template", error);
            alert('Failed to save template');
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess('Скопировано!');
            setTimeout(() => setCopySuccess(''), 500);
        }, (err) => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <Box>
            <CalculatorMenu calculatorId={id} />
            <Typography variant="h4" gutterBottom mt={2} mb={2}>
                Шаблон
            </Typography>
            <Box mb={2}>
                <Alert variant="outlined" severity="info">
                    Для вставки значений переменных используйте формат <Box component="span" sx={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '0 4px', borderRadius: '4px' }}>{'{{ variable_name }}'}</Box>
                </Alert>
            </Box>
            <TextField
                label="HTML-код"
                multiline
                rows={10}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                variant="outlined"
                fullWidth
            />
            <Box sx={{ marginTop: 2 }}>
                <Button startIcon={<SaveIcon />} variant="contained" color="primary" onClick={handleSave}>
                    Сохранить
                </Button>
            </Box>
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Доступные теги
                </Typography>
                <Box>
                    {variables.map((variable, index) => (
                        <Tooltip key={index} arrow placement={"top"} title={copySuccess ? copySuccess : variable.name}>
                            <Chip
                                clickable
                                size="small"
                                label={`{{ ${variable.tag_name} }}`}
                                variant="outlined"
                                onClick={() => handleCopy(`{{ ${variable.tag_name} }}`)}
                                sx={{ margin: 0.5 }}
                            />
                        </Tooltip>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default TemplateForm;
