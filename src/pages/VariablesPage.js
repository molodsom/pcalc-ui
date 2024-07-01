import React, { useState, useEffect, useCallback } from 'react';
import {useParams} from 'react-router-dom';
import axios from '../api/axios';
import VariableList from '../components/VariableList';
import VariableForm from '../components/VariableForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {Typography, Box} from '@mui/material';
import CalculatorMenu from "../components/CalculatorMenu";

function VariablesPage() {
  const { id } = useParams();
  const [variables, setVariables] = useState([]);
  const [maxOrder, setMaxOrder] = useState(0);

  const fetchVariables = useCallback(async () => {
    const response = await axios.get(`/calculator/${id}/variable`);
    const fetchedVariables = response.data;
    setVariables(fetchedVariables);
    const maxOrderValue = fetchedVariables.reduce((max, variable) => Math.max(max, variable.order), 0);
    setMaxOrder(maxOrderValue);
  }, [id]);

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const createVariable = async (variable) => {
    const newVariable = { ...variable, order: maxOrder + 1 };
    await axios.post(`/calculator/${id}/variable`, [newVariable]);
    fetchVariables();
  };

  const updateVariableOrder = async (variables) => {
    await axios.put(`/calculator/${id}/variable`, variables);
    fetchVariables();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(variables);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    items.forEach((item, index) => {
      item.order = index + 1;
    });
    setVariables(items);
    updateVariableOrder(items);
  };

  const updateVariable = (updatedVariable) => {
    setVariables((prevVariables) =>
        prevVariables.map((variable) =>
            variable._id === updatedVariable._id ? updatedVariable : variable
        )
    );
  };

  const deleteVariable = async (variableId) => {
    await axios.delete(`/calculator/${id}/variable/${variableId}`);
    fetchVariables();
  };

  return (
      <Box>
        <Typography variant="h4" gutterBottom>
          <CalculatorMenu calculatorId={id} />
        </Typography>
        <Typography variant="h4" gutterBottom>
          Переменные
        </Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="variables">
            {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {variables.map((variable, index) => (
                      <Draggable key={variable._id} draggableId={variable._id} index={index}>
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ marginBottom: 2, padding: 2, border: '1px solid #ccc', borderRadius: 1 }}
                            >
                              <VariableList variable={variable} onSave={updateVariable} onDelete={deleteVariable} />
                            </Box>
                        )}
                      </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
            )}
          </Droppable>
        </DragDropContext>
        <VariableForm onSubmit={createVariable} />
      </Box>
  );
}

export default VariablesPage;
