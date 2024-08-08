import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import VariableList from '../components/VariableList';
import VariableForm from '../components/VariableForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Typography, Box, Button } from '@mui/material';
import CalculatorMenu from "../components/CalculatorMenu";
import AddIcon from "@mui/icons-material/Add";
import useAxios from "../api/useAxios";

function VariablesPage() {
  const axios = useAxios();
  const { id } = useParams();
  const [variables, setVariables] = useState([]);
  const [maxOrder, setMaxOrder] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const fetchVariables = useCallback(async () => {
    const response = await axios.get(`/calculator/${id}/variable`);
    const fetchedVariables = response.data;
    fetchedVariables.sort((a, b) => a.order - b.order);
    setVariables(fetchedVariables);
    const maxOrderValue = fetchedVariables.reduce((max, variable) => Math.max(max, variable.order), 0);
    setMaxOrder(maxOrderValue);
  }, [id]);

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  const createVariable = async (variable) => {
    const newVariable = { ...variable, order: maxOrder + 1, calculator_id: id };
    await axios.post(`/calculator/${id}/variable`, [newVariable]);
    fetchVariables();
    setIsAdding(false);
  };

  const updateVariable = async (updatedVariable) => {
    await axios.patch(`/calculator/${id}/variable/${updatedVariable._id}`, updatedVariable);
    fetchVariables();
  };

  const deleteVariable = async (variableId) => {
    await axios.delete(`/calculator/${id}/variable/${variableId}`);
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
    updateVariableOrder(items).then(_ => {});
  };

  const initialVariable = {
    tag_name: '',
    name: '',
    data_type: 'str',
    default_value: '',
    widget: '',
    required: false,
    is_output: false,
    formula: '',
    choices: [],
    order: maxOrder + 1
  };

  return (
      <Box>
        <CalculatorMenu calculatorId={id} />
        <Typography variant="h4" gutterBottom mt={2} mb={2}>
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
        {isAdding ? (
            <VariableForm
                variable={initialVariable}
                calculatorId={id}
                onSave={createVariable}
                onCancel={() => setIsAdding(false)}
            />
        ) : (
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => setIsAdding(true)}>Добавить</Button>
        )}
      </Box>
  );
}

export default VariablesPage;
