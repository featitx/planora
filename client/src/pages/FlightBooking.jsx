import React, { useState } from 'react';
import FlightBookingListing from '../components/FlightBookingListing';
import { ArrowLeft, Plus, Minus, Plane, Clock, Calendar, Users, MapPin, CreditCard, User, Mail, Phone, AlertCircle, Check } from 'lucide-react';
import { useParams } from 'react-router-dom';


const FlightBooking = ({ flights, onBack, onConfirmBooking  }) => {



   const { id } = useParams();
  const flight = flights.find(f => f.id === parseInt(id));

  if (!flight) {
    return <div className="text-center py-12">Flight not found or loading...</div>;
  }

  const [passengers, setPassengers] = useState([
    {
      id: 1,
      title: 'Mr.',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: 'Indian'
    }
  ]);

  const [contactDetails, setContactDetails] = useState({
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const [selectedSeats, setSelectedSeats] = useState({});
  const [specialRequests, setSpecialRequests] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Add passenger (max 4)
  const addPassenger = () => {
    if (passengers.length < 4) {
      setPassengers([...passengers, {
        id: Date.now(),
        title: 'Mr.',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        nationality: 'Indian'
      }]);
    }
  };

  // Remove passenger (min 1)
  const removePassenger = (id) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter(p => p.id !== id));
      const newSelectedSeats = { ...selectedSeats };
      delete newSelectedSeats[id];
      setSelectedSeats(newSelectedSeats);
    }
  };

  // Update passenger details
  const updatePassenger = (id, field, value) => {
    setPassengers(passengers.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Format duration
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate total price
  const totalPrice = flight.price * passengers.length;
  const taxes = Math.round(totalPrice * 0.12);
  const totalAmount = totalPrice + taxes;

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    
    // Simulate booking process
    setTimeout(() => {
      const bookingData = {
        flight,
        passengers,
        contactDetails,
        paymentDetails,
        selectedSeats,
        specialRequests,
        totalAmount,
        bookingId: 'BK' + Date.now(),
        bookingDate: new Date().toISOString()
      };
      
      setIsProcessing(false);
      onConfirmBooking(bookingData);
    }, 2000);
  };

  // Validate form
  const isFormValid = () => {
    const passengersValid = passengers.every(p => 
      p.firstName && p.lastName && p.email && p.phone && p.dateOfBirth
    );
    const contactValid = contactDetails.email && contactDetails.phone;
    const paymentValid = paymentDetails.cardNumber && paymentDetails.expiryDate && 
                        paymentDetails.cvv && paymentDetails.cardholderName;
    
    return passengersValid && contactValid && paymentValid;
  };

  if (!flight) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-xl text-gray-600">Flight details not found</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-white hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Complete Your Booking</h1>
            <p className="text-gray-600">Fill in the details to confirm your flight</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Flight Summary Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Plane className="w-5 h-5 mr-2 text-blue-600" />
                Flight Details
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-2 rounded-lg">
                      <Plane className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{flight.airline}</h3>
                      <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    flight.class === 'Economy' ? 'bg-blue-100 text-blue-800' :
                    flight.class === 'Premium Economy' ? 'bg-purple-100 text-purple-800' :
                    flight.class === 'Business' ? 'bg-gold-100 text-gold-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {flight.class}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{flight.departure.time}</p>
                    <p className="text-sm text-gray-600">{flight.departure.code}</p>
                    <p className="text-xs text-gray-500">{flight.departure.city}</p>
                  </div>
                  
                  <div className="flex-1 px-4">
                    <div className="text-center mb-2">
                      <p className="text-sm text-gray-600">{formatDuration(flight.duration)}</p>
                    </div>
                    <div className="relative">
                      <div className="h-0.5 bg-gray-300"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1">
                        {flight.stops === 0 ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : (
                          <div className="text-xs text-gray-600 bg-white px-1">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{flight.arrival.time}</p>
                    <p className="text-sm text-gray-600">{flight.arrival.code}</p>
                    <p className="text-xs text-gray-500">{flight.arrival.city}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/50 flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {flight.date}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {flight.availableSeats} seats left
                  </span>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Passenger Details ({passengers.length})
                </h2>
                {passengers.length < 4 && (
                  <button
                    onClick={addPassenger}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Passenger
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={passenger.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800">Passenger {index + 1}</h3>
                      {passengers.length > 1 && (
                        <button
                          onClick={() => removePassenger(passenger.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <select
                          value={passenger.title}
                          onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter first name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter last name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updatePassenger(passenger.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          value={passenger.phone}
                          onChange={(e) => updatePassenger(passenger.id, 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                        <input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => updatePassenger(passenger.id, 'dateOfBirth', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) => setContactDetails({...contactDetails, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter contact email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={contactDetails.phone}
                    onChange={(e) => setContactDetails({...contactDetails, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter contact phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={contactDetails.emergencyContact}
                    onChange={(e) => setContactDetails({...contactDetails, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emergency contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={contactDetails.emergencyPhone}
                    onChange={(e) => setContactDetails({...contactDetails, emergencyPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emergency contact phone"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Special Requests</h2>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requirements or requests..."
              />
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Payment Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                  <input
                    type="text"
                    value={paymentDetails.cardholderName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardholderName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter cardholder name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                  <input
                    type="text"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                  <input
                    type="text"
                    value={paymentDetails.cvv}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">${flight.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-medium">× {passengers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">${taxes}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                    <span className="text-lg font-bold text-blue-600">${totalAmount}</span>
                  </div>
                </div>
              </div>

              {!isFormValid() && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">Please fill in all required fields to continue</p>
                </div>
              )}

              <button
                onClick={handleConfirmBooking}
                disabled={!isFormValid() || isProcessing}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isFormValid() && !isProcessing
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </div>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4 text-center">
                By confirming this booking, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;