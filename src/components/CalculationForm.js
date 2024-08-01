import React from 'react';
import { TextField, Box, FormControl, Checkbox, FormControlLabel, Autocomplete } from '@mui/material';

function CalculationForm({ variables, values, onChange, errors }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {variables
                .filter((variable) => variable.widget)
                .map((variable) => (
                    <FormControl key={variable._id} fullWidth>
                        {variable.data_type === 'str' && variable.widget === 'dropdown' ? (
                            <Autocomplete
                                size="small"
                                options={variable.choices || []}
                                value={values[variable.tag_name] || ''}
                                onChange={(event, newValue) => onChange(variable.tag_name, newValue)}
                                isOptionEqualToValue={(option, value) => option === value}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={variable.name}
                                        variant="outlined"
                                        error={!!errors[variable.tag_name]}
                                        helperText={errors[variable.tag_name] || ''}
                                        placeholder={variable.placeholder || ''}
                                    />
                                )}
                            />
                        ) : (
                            <>
                                {variable.data_type === 'str' && (
                                    <TextField
                                        size="small"
                                        label={variable.name}
                                        value={values[variable.tag_name] ?? ''}
                                        onChange={(e) => onChange(variable.tag_name, e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors[variable.tag_name]}
                                        helperText={errors[variable.tag_name] || ''}
                                        placeholder={variable.placeholder || ''}
                                    />
                                )}
                                {variable.data_type === 'int' && (
                                    <TextField
                                        size="small"
                                        type="number"
                                        label={variable.name}
                                        value={values[variable.tag_name] ?? ''}
                                        onChange={(e) => onChange(variable.tag_name, parseInt(e.target.value, 10))}
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors[variable.tag_name]}
                                        helperText={errors[variable.tag_name] || ''}
                                        placeholder={variable.placeholder || ''}
                                    />
                                )}
                                {variable.data_type === 'float' && (
                                    <TextField
                                        size="small"
                                        type="number"
                                        label={variable.name}
                                        value={values[variable.tag_name] ?? ''}
                                        onChange={(e) => onChange(variable.tag_name, parseFloat(e.target.value))}
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors[variable.tag_name]}
                                        helperText={errors[variable.tag_name] || ''}
                                        placeholder={variable.placeholder || ''}
                                    />
                                )}
                                {variable.data_type === 'bool' && (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{ p: 0, pl: 1, pr: 1 }}
                                                checked={values[variable.tag_name] ?? false}
                                                onChange={(e) => onChange(variable.tag_name, e.target.checked)}
                                            />
                                        }
                                        label={variable.name}
                                    />
                                )}
                            </>
                        )}
                    </FormControl>
                ))}
        </Box>
    );
}

export default CalculationForm;
