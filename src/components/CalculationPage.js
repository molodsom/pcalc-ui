import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import CalculationForm from '../components/CalculationForm';
import {Box, Typography, Button, FormControlLabel, Checkbox, FormControl, Grid} from '@mui/material';
import CalculatorMenu from "./CalculatorMenu";

function CalculationPage() {
    const { id } = useParams();
    const [variables, setVariables] = useState([]);
    const [values, setValues] = useState({});
    const [results, setResults] = useState({});
    const [asHtml, setAsHtml] = useState(true);
    const [htmlResult, setHtmlResult] = useState("");
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
            params: { as_html: asHtml },
        });
        if (asHtml) {
            setHtmlResult(response.data.html);
        } else {
            setResults(response.data);
        }
    };

    return (
        <Box>
            <CalculatorMenu calculatorId={id} />
            <Typography variant="h4" gutterBottom>
                Расчёт
            </Typography>
            <CalculationForm
                variables={variables}
                values={values}
                onChange={handleChange}
                errors={errors}
            />
            <Box container mt={2} spacing={2}>
                <Box>
                    <FormControlLabel
                        control={
                            <Checkbox

                                checked={asHtml}
                                onChange={(e) => setAsHtml(e.target.checked)}
                            />
                        }
                        label="HTML"
                    />
                </Box>
                <Box>
                    <FormControl>
                        <Button variant="contained" color="primary" onClick={handleCalculate}>
                            Рассчитать
                        </Button>
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Результаты
                </Typography>
                {asHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: htmlResult }} />
                ) : (
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                )}
            </Box>
        </Box>
    );
}

export default CalculationPage;
