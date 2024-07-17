import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

function CalculatorList({ calculators }) {
    return (
        <Paper elevation={1} sx={{ marginTop: 2 }}>
            <List>
                {calculators.map((calculator) => (
                    <ListItem key={calculator._id} component={Link} to={`/calculator/${calculator._id}/variables`} button>
                        <ListItemText primary={calculator.name} />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default CalculatorList;