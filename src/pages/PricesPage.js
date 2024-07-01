import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import PriceList from '../components/PriceList';
import PriceForm from '../components/PriceForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography, Box } from '@mui/material';
import CalculatorMenu from "../components/CalculatorMenu";

function PricesPage() {
  const { id } = useParams();
  const [prices, setPrices] = useState([]);

  const fetchPrices = useCallback(async () => {
    const response = await axios.get(`/calculator/${id}/price`);
    setPrices(response.data);
  }, [id]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const createPrice = async (price) => {
    await axios.post(`/calculator/${id}/price`, [price]);
    fetchPrices();
  };

  const updatePriceOrder = async (prices) => {
    await axios.put(`/calculator/${id}/price`, prices);
    fetchPrices();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(prices);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    items.forEach((item, index) => {
      item.order = index + 1;
    });
    setPrices(items);
    updatePriceOrder(items);
  };

  const updatePrice = (updatedPrice) => {
    setPrices((prevPrices) =>
        prevPrices.map((price) =>
            price._id === updatedPrice._id ? updatedPrice : price
        )
    );
  };

  const deletePrice = async (priceId) => {
    await axios.delete(`/calculator/${id}/price/${priceId}`);
    fetchPrices();
  };

  return (
      <Box>
        <CalculatorMenu calculatorId={id} />
        <Typography variant="h4" gutterBottom>
          Цены
        </Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="prices">
            {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {prices.map((price, index) => (
                      <Draggable key={price._id} draggableId={price._id} index={index}>
                        {(provided) => (
                            <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ marginBottom: 2, padding: 2, border: '1px solid #ccc', borderRadius: 1 }}
                            >
                              <PriceList price={price} onSave={updatePrice} onDelete={deletePrice} />
                            </Box>
                        )}
                      </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
            )}
          </Droppable>
        </DragDropContext>
        <PriceForm onSubmit={createPrice} />
      </Box>
  );
}

export default PricesPage;
