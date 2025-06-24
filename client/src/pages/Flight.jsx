import React, { useState , useEffect } from 'react';
import FlightBookingListing from '../components/FlightBookingListing';
import FlightBooking from './FlightBooking';
import { useParams } from 'react-router-dom';
import axios from "axios";

const Flight = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);                                                                               

  const { id } = useParams();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/flights");
        setFlights(res.data.flights);   
      } catch (err) {
        console.error("Error fetching flights:", err);
        setError("Failed to load flights");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading flights...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (id) {
    return <FlightBooking flights={flights} />;
  }

  return <FlightBookingListing flights={flights} />;
};

export default Flight;
