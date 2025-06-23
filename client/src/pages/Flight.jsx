import React, { useState } from 'react';
import FlightBookingListing from '../components/FlightBookingListing';
import FlightBooking from './FlightBooking';
import { useParams } from 'react-router-dom';

const Flight = () => {
 const [flights] = useState([
     {
       id: 1,
       airline: 'SkyWings',
       flightNumber: 'SW 1234',
       departure: { code: 'BOM', city: 'Mumbai', time: '09:30' },
       arrival: { code: 'DEL', city: 'Delhi', time: '11:45' },
       duration: 135,
       price: 299,
       date: 'Jun 20, 2025',
       stops: 0,
       availableSeats: 12,
       class: 'Economy'
     },
     {
       id: 2,
       airline: 'AirConnect',
       flightNumber: 'AC 5678',
       departure: { code: 'BOM', city: 'Mumbai', time: '14:15' },
       arrival: { code: 'DEL', city: 'Delhi', time: '16:50' },
       duration: 155,
       price: 425,
       date: 'Jun 20, 2025',
       stops: 1,
       availableSeats: 0,
       class: 'Business'
     },
     {
       id: 3,
       airline: 'JetStream',
       flightNumber: 'JS 9012',
       departure: { code: 'BOM', city: 'Mumbai', time: '18:20' },
       arrival: { code: 'DEL', city: 'Delhi', time: '20:30' },
       duration: 130,
       price: 350,
       date: 'Jun 20, 2025',
       stops: 0,
       availableSeats: 8,
       class: 'Premium Economy'
     },
     {
       id: 4,
       airline: 'CloudNine Airways',
       flightNumber: 'CN 3456',
       departure: { code: 'BOM', city: 'Mumbai', time: '21:00' },
       arrival: { code: 'DEL', city: 'Delhi', time: '23:15' },
       duration: 135,
       price: 289,
       date: 'Jun 20, 2025',
       stops: 0,
       availableSeats: 25,
       class: 'Economy'
     },
     {
       id: 5,
       airline: 'Luxury Air',
       flightNumber: 'LA 7890',
       departure: { code: 'BOM', city: 'Mumbai', time: '06:45' },
       arrival: { code: 'DEL', city: 'Delhi', time: '09:10' },
       duration: 145,
       price: 650,
       date: 'Jun 20, 2025',
       stops: 0,
       availableSeats: 0,
       class: 'First Class'
     },
     {
       id: 6,
       airline: 'Budget Wings',
       flightNumber: 'BW 2468',
       departure: { code: 'BOM', city: 'Mumbai', time: '12:30' },
       arrival: { code: 'DEL', city: 'Delhi', time: '15:45' },
       duration: 195,
       price: 199,
       date: 'Jun 20, 2025',
       stops: 2,
       availableSeats: 15,
       class: 'Economy'
     }
   ]);

  const { id } = useParams();

  if (id) {
    
    return <FlightBooking flights={flights} />;
  }

  
  return <FlightBookingListing flights={flights} />;
};

export default Flight;
