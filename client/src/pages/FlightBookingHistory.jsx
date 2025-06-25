import React, { useEffect, useState } from 'react';
import { 
  Plane,
  Download,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import Title from '../components/Title';
import { assets } from '../assets/assets';

const FlightBookingHistory = () => {
  const { axios, getToken, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data } = await axios.get('/api/flights/user', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }

      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      setError(err.response?.data?.message || err.message);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = (booking) => {
    const ticketData = {
      bookingId: booking._id,
      flight: booking.flight,
      passengers: booking.passengers,
      contactDetails: booking.contactDetails,
      totalPrice: booking.totalPrice,
      bookingDate: booking.bookingDate,
      isPaid: booking.isPaid
    };

    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `flight-ticket-${booking._id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const BookingModal = ({ booking, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Flight Ticket Details</h2>
              <p className="text-blue-100">Booking ID: {booking._id?.slice(-8)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Plane className="w-5 h-5 mr-2 text-blue-600" />
              Flight Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Airline</p>
                <p className="font-medium">{booking.flight?.airline || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Flight Number</p>
                <p className="font-medium">{booking.flight?.flightNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-medium">{booking.flight?.departure?.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">To</p>
                <p className="font-medium">{booking.flight?.arrival?.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-medium">
                  {booking.flight?.date ? formatDate(booking.flight.date) : 'N/A'} at {booking.flight?.departure?.time || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Arrival</p>
                <p className="font-medium">
                  {booking.flight?.date ? formatDate(booking.flight.date) : 'N/A'} at {booking.flight?.arrival?.time || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => downloadTicket(booking)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Flight Bookings"
        subTitle="View and manage all your past and upcoming flight reservations in one place"
        align="left"
      />
      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Flight Details</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Status</div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
            <p className="text-gray-500">You haven't made any flight bookings yet.</p>
          </div>
        ) : (
          <>
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="bg-blue-100 p-3 rounded-lg flex items-center justify-center min-md:w-20">
                    <Plane className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                    <p className="font-playfair text-2xl">
                      {booking.flight?.airline}
                      <span className="font-inter text-sm">
                        {' '}
                        ({booking.flight?.flightNumber})
                      </span>
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
                      <span>
                        {booking.flight?.departure?.city} → {booking.flight?.arrival?.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.guestsIcon} alt="guests-icon" className="w-4 h-4" />
                      <span>Passengers: {booking.passengers?.length || 0}</span>
                    </div>
                    <p className="text-base">Total: {currency}{booking.totalPrice?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                  <div>
                    <p>Departure:</p>
                    <p className="text-gray-500 text-sm">
                      {booking.flight?.date ? formatDate(booking.flight.date) : 'N/A'} at {booking.flight?.departure?.time || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p>Arrival:</p>
                    <p className="text-gray-500 text-sm">
                      {booking.flight?.date ? formatDate(booking.flight.date) : 'N/A'} at {booking.flight?.arrival?.time || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-center pt-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        booking.isPaid ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                    <p
                      className={`text-sm ${
                        booking.isPaid ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {booking.isPaid ? 'Confirmed' : 'Pending Payment'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadTicket(booking);
                    }}
                    className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {selectedBooking && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FlightBookingHistory;