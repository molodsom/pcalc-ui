import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@mui/material';

function CalculatorList({ calculators }) {
  return (
      <List>
        {calculators.map((calculator) => (
            <ListItem key={calculator._id} component={Link} to={`/calculator/${calculator._id}`}>
              <ListItemText primary={calculator.name} />
            </ListItem>
        ))}
      </List>
  );
}

export default CalculatorList;
