import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../api/axios'; // Импортируйте настроенный экземпляр

function CalculatorPage() {
    const { id } = useParams();
    const [calculator, setCalculator] = useState(null);

    useEffect(() => {
        fetchCalculator();
    }, [id]);

    const fetchCalculator = async () => {
        const response = await axios.get(`/calculator/${id}`);
        setCalculator(response.data);
    };

    const updateCalculator = async (name) => {
        await axios.patch(`/calculator/${id}`, { name });
        fetchCalculator();
    };

    return (
        <div>
            {calculator && (
                <>
                    <h1>{calculator.name}</h1>
                    <button onClick={() => updateCalculator(prompt('New name', calculator.name))}>Edit Name</button>
                    <div>
                        <Link to={`/calculator/${id}/variables`}>Edit Variables</Link>
                        <Link to={`/calculator/${id}/prices`}>Edit Prices</Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default CalculatorPage;
