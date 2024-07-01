import React from 'react';
import { TextField, Box, FormControl, Checkbox, FormControlLabel } from '@mui/material';

function CalculationForm({ variables, values, onChange, errors }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {variables
                .filter((variable) => variable.widget) // Отображаем только поля с widget
                .map((variable) => (
                    <FormControl key={variable._id} fullWidth sx={{ mb: 2 }}>
                        {variable.data_type === 'str' && (
                            <TextField
                                label={variable.name}
                                value={values[variable.tag_name] ?? ''}
                                onChange={(e) => onChange(variable.tag_name, e.target.value)}
                                variant="outlined"
                                fullWidth
                                error={!!errors[variable.tag_name]}
                                helperText={errors[variable.tag_name]}
                            />
                        )}
                        {variable.data_type === 'int' && (
                            <TextField
                                type="number"
                                label={variable.name}
                                value={values[variable.tag_name] ?? ''}
                                onChange={(e) => onChange(variable.tag_name, parseInt(e.target.value, 10))}
                                variant="outlined"
                                fullWidth
                                error={!!errors[variable.tag_name]}
                                helperText={errors[variable.tag_name]}
                            />
                        )}
                        {variable.data_type === 'float' && (
                            <TextField
                                type="number"
                                label={variable.name}
                                value={values[variable.tag_name] ?? ''}
                                onChange={(e) => onChange(variable.tag_name, parseFloat(e.target.value))}
                                variant="outlined"
                                fullWidth
                                error={!!errors[variable.tag_name]}
                                helperText={errors[variable.tag_name]}
                            />
                        )}
                        {variable.data_type === 'bool' && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={values[variable.tag_name] ?? false}
                                        onChange={(e) => onChange(variable.tag_name, e.target.checked)}
                                    />
                                }
                                label={variable.name}
                                error={!!errors[variable.tag_name]}
                                helperText={errors[variable.tag_name]}
                            />
                        )}
                    </FormControl>
                ))}
        </Box>
    );
}

export default CalculationForm;
