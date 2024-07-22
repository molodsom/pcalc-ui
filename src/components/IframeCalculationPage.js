import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import CalculationForm from '../components/CalculationForm';
import { Box, Button, FormControl } from '@mui/material';

function IframeCalculationPage() {
    const { id } = useParams();
    const [variables, setVariables] = useState([]);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchVariables = async () => {
            const response = await axios.get(`/calculator/${id}/variable`);
            setVariables(response.data);
            const initialValues = response.data.reduce((acc, variable) => {
                if (variable.data_type === 'bool') {
                    acc[variable.tag_name] = variable.default_value ?? false;
                } else {
                    acc[variable.tag_name] = variable.default_value ?? '';
                }
                return acc;
            }, {});
            setValues(initialValues);
        };

        fetchVariables();
    }, [id]);

    const handleChange = (tag_name, value) => {
        setValues({
            ...values,
            [tag_name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};
        variables.forEach((variable) => {
            if (variable.required && !values[variable.tag_name] && values[variable.tag_name] !== false) {
                newErrors[variable.tag_name] = 'Это поле обязательное';
            }
        });
        setErrors(newErrors);
        console.log(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCalculate = async () => {
        if (!validate()) {
            return;
        }
        const response = await axios.post(`/calculator/${id}`, values, {
            params: { as_html: false },
        });
        const jsonResult = response.data;

        const htmlResponse = await axios.post(`/calculator/${id}`, values, {
            params: { as_html: true },
        });
        const htmlResult = htmlResponse.data.html;

        window.parent.postMessage({ type: 'result', data: { json: jsonResult, html: htmlResult } }, '*');
    };

    return (
        <Box mt={2}>
            <CalculationForm
                variables={variables}
                values={values}
                onChange={handleChange}
                errors={errors}
            />
            <Box container mt={2} spacing={2}>
                <Box>
                    <FormControl>
                        <Button variant="contained" color="primary" onClick={handleCalculate}>
                            Рассчитать
                        </Button>
                    </FormControl>
                </Box>
            </Box>
        </Box>
    );
}

export default IframeCalculationPage;
