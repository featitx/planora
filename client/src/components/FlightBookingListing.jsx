import React, { useState, useMemo } from 'react';
import FlightCard from './FlightCard.jsx'
import { useNavigate } from 'react-router-dom';
import { Plane, Clock, Calendar, Users, MapPin, Search } from 'lucide-react';


const FlightBookingListing = ({flights}) => {
   
 
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
 
  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStops, setSelectedStops] = useState('');
  const [sortBy, setSortBy] = useState('price');

 
  const handleSearch = () => {
    console.log('Searching flights from', fromCity, 'to', toCity, 'on', selectedDate);
  };

  // Filter and sort flights
  const filteredAndSortedFlights = useMemo(() => {
    let filtered = flights.filter(flight => {
    
      const matchesRoute = (!fromCity || flight.departure.code === fromCity) &&
                          (!toCity || flight.arrival.code === toCity);

      // Date filter
      const matchesDate = !selectedDate || flight.date === new Date(selectedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Search filter
      const matchesSearch = searchTerm === '' || 
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase());

      // Price filter
      const matchesPrice = maxPrice === '' || flight.price <= parseInt(maxPrice);

      // Class filter
      const matchesClass = selectedClass === '' || flight.class === selectedClass;

      // Stops filter
      const matchesStops = selectedStops === '' || 
        (selectedStops === '2' && flight.stops >= 2) ||
        flight.stops === parseInt(selectedStops);

      return matchesRoute && matchesDate && matchesSearch && matchesPrice && matchesClass && matchesStops;
    });

    // Sort flights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'duration':
          return a.duration - b.duration;
        case 'departure':
          return a.departure.time.localeCompare(b.departure.time);
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, fromCity, toCity, selectedDate, searchTerm, maxPrice, selectedClass, selectedStops, sortBy]);

  const clearFilters = () => {
    setFromCity('');
    setToCity('');
    setSelectedDate('');
    setSearchTerm('');
    setMaxPrice('');
    setSelectedClass('');
    setSelectedStops('');
    setSortBy('price');
  };


const navigate = useNavigate();

const handleBooking = (flight) => {
  navigate(`/flight/${flight._id}/flight-booking`, { state: { flight } });
};

  const availableFlights = filteredAndSortedFlights.filter(flight => flight.availableSeats > 0);
  const soldOutFlights = filteredAndSortedFlights.filter(flight => flight.availableSeats === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 pt-[22%] lg:pt-[8%] ">
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Book Your Flight
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search and compare flights to find the best deals for your journey
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          {/* Main Search Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* From Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select departure city</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="DEL">Delhi (DEL)</option>
                  <option value="BLR">Bangalore (BLR)</option>
                  <option value="HYD">Hyderabad (HYD)</option>
                  <option value="CCU">Kolkata (CCU)</option>
                  <option value="MAA">Chennai (MAA)</option>
                </select>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* To Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Select destination city</option>
                  <option value="BOM">Mumbai (BOM)</option>
                  <option value="DEL">Delhi (DEL)</option>
                  <option value="BLR">Bangalore (BLR)</option>
                  <option value="HYD">Hyderabad (HYD)</option>
                  <option value="CCU">Kolkata (CCU)</option>
                  <option value="MAA">Chennai (MAA)</option>
                </select>
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={!fromCity || !toCity}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  fromCity && toCity
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search Flights
                </div>
              </button>
            </div>
          </div>

          {/* Secondary Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 pt-4 border-t border-gray-100">
            {/* Airline/Flight Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Airlines</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Airline or flight number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Price</option>
                <option value="300">Under $300</option>
                <option value="400">Under $400</option>
                <option value="500">Under $500</option>
                <option value="600">Under $600</option>
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Classes</option>
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First Class">First Class</option>
              </select>
            </div>

            {/* Stops Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
              <select
                value={selectedStops}
                onChange={(e) => setSelectedStops(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Stops</option>
                <option value="0">Non-stop</option>
                <option value="1">1 Stop</option>
                <option value="2">2+ Stops</option>
              </select>
            </div>
          </div>

          {/* Sort and Clear */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="price">Price (Low to High)</option>
                <option value="priceDesc">Price (High to Low)</option>
                <option value="duration">Duration (Shortest)</option>
                <option value="departure">Departure Time</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-gray-600">
                Showing {filteredAndSortedFlights.length} flights 
                {fromCity && toCity && ` from ${fromCity} to ${toCity}`}
                {selectedDate && ` on ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </p>
              {(searchTerm || maxPrice || selectedClass || selectedStops) && (
                <p className="text-sm text-blue-600 mt-1">Additional filters applied</p>
              )}
            </div>
            {fromCity && toCity && (
              <div className="mt-2 sm:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {fromCity} → {toCity}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Flight Results */}
        {filteredAndSortedFlights.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No flights found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria, route, or date selection</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Available Flights */}
            {availableFlights.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Available Flights ({availableFlights.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {availableFlights.map(flight => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onBook={handleBooking}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sold Out Flights */}
            {soldOutFlights.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Sold Out Flights ({soldOutFlights.length})
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {soldOutFlights.map(flight => (
                    <div key={flight.id} className="opacity-60">
                      <FlightCard
                        flight={flight}
                        onBook={handleBooking}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default FlightBookingListing;