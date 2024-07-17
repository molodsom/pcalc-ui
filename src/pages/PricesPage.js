import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import PriceList from '../components/PriceList';
import PriceForm from '../components/PriceForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Typography, Box, Button } from '@mui/material';
import CalculatorMenu from "../components/CalculatorMenu";
import AddIcon from "@mui/icons-material/Add";

function PricesPage() {
  const { id } = useParams();
  const [prices, setPrices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const fetchPrices = useCallback(async () => {
    const response = await axios.get(`/calculator/${id}/price`);
    setPrices(response.data);
  }, [id]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const createPrice = async (price) => {
    await axios.post(`/calculator/${id}/price`, { ...price, order: getLastOrder() });
    fetchPrices();
    setIsAdding(false);
  };

  const updatePriceOrder = async (prices) => {
    await axios.put(`/calculator/${id}/price`, prices);
    fetchPrices();
  };

  const getLastOrder = () => {
    return prices.reduce((max, item) => Math.max(max, item.order || 0), 0) + 1;
  }

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
        <Typography variant="h4" gutterBottom mt={2} mb={2}>
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
        {isAdding ? (
            <PriceForm calculatorId={id} onSave={createPrice} onCancel={() => setIsAdding(false)} />
        ) : (
            <Button startIcon={<AddIcon />} variant="contained" onClick={() => setIsAdding(true)}>Добавить</Button>
        )}
      </Box>
  );
}

export default PricesPage;
