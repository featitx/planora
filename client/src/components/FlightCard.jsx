import React, { useState, useMemo } from 'react';
import { Plane, Clock, Calendar, Users, MapPin, Search } from 'lucide-react';

const FlightCard = ({ flight, onBook }) => {
  const formatTime = (time) => {
    return new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{flight.airline}</h3>
            <p className="text-sm text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">${flight.price}</p>
          <p className="text-sm text-gray-500">per person</p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="flex items-center space-x-1 mb-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <p className="font-semibold text-lg">{flight.departure.code}</p>
          </div>
          <p className="text-sm text-gray-600">{flight.departure.city}</p>
          <p className="text-lg font-medium">{formatTime(flight.departure.time)}</p>
        </div>

        <div className="flex-1 px-4">
          <div className="relative">
            <div className="h-0.5 bg-gray-300 w-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <Plane className="w-4 h-4 text-gray-400 rotate-90" />
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm text-gray-500 flex items-center justify-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(flight.duration)}
            </p>
            {flight.stops === 0 ? (
              <p className="text-xs text-green-600 font-medium">Non-stop</p>
            ) : (
              <p className="text-xs text-orange-600 font-medium">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center space-x-1 mb-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <p className="font-semibold text-lg">{flight.arrival.code}</p>
          </div>
          <p className="text-sm text-gray-600">{flight.arrival.city}</p>
          <p className="text-lg font-medium">{formatTime(flight.arrival.time)}</p>
        </div>
      </div>

      {/* Flight Details */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {flight.date}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {flight.availableSeats} seats left
          </div>
        </div>
        <div className="text-sm">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            {flight.class}
          </span>
        </div>
      </div>

      {/* Booking Button */}
      <button
        onClick={() => onBook(flight)}
        disabled={flight.availableSeats === 0}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
          flight.availableSeats === 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
        }`}
      >
        {flight.availableSeats === 0 ? 'SOLD OUT' : 'Book Now'}
      </button>
    </div>
  );
};


export default FlightCard ; 
