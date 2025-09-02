import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { mockBiddingSessions } from '../utils/biddingData';
import { BiddingSession } from '../types/bidding';

const BiddingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties } = useApp();
  const [biddingSession, setBiddingSession] = useState<BiddingSession | null>(null);
  const [newBidAmount, setNewBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  const property = properties.find(p => p.id === id);

  useEffect(() => {
    if (id && mockBiddingSessions[id]) {
      setBiddingSession(mockBiddingSessions[id]);
    }
  }, [id]);

  useEffect(() => {
    if (!biddingSession) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(biddingSession.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Bidding Ended');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [biddingSession]);

  const handlePlaceBid = () => {
    const amount = parseFloat(newBidAmount);
    if (amount && biddingSession && amount > (biddingSession.currentHighestBid?.amount || biddingSession.minBidAmount)) {
      // In real app, make API call to place bid
      console.log('Placing bid:', amount);
      setNewBidAmount('');
    }
  };

  if (!property || !biddingSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatPrice = (price: number) => `₹${(price / 100000).toFixed(1)} Lakhs`;
  const minNextBid = (biddingSession.currentHighestBid?.amount || biddingSession.minBidAmount) + biddingSession.bidIncrement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-background-light z-50 overflow-y-auto"
      style={{ paddingTop: '80px', paddingLeft: '64px' }}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </button>
          <div className="text-sm text-text-muted">
            Bidding Session • {biddingSession.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-2xl font-bold text-text-primary mb-2">{property.title}</h1>
                <div className="flex items-center text-text-muted mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{property.address}, {property.city}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-background-light rounded-lg">
                    <div className="font-bold text-primary">{property.bhk}</div>
                    <div className="text-sm text-text-muted">Configuration</div>
                  </div>
                  <div className="p-3 bg-background-light rounded-lg">
                    <div className="font-bold text-primary">{property.area}</div>
                    <div className="text-sm text-text-muted">Sq Ft</div>
                  </div>
                  <div className="p-3 bg-background-light rounded-lg">
                    <div className="font-bold text-primary capitalize">{property.type}</div>
                    <div className="text-sm text-text-muted">Type</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Bid History</h3>
              <div className="space-y-4">
                {biddingSession.bids.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between p-4 bg-background-light rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-4">
                        {bid.bidder.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{bid.bidder.name}</div>
                        <div className="text-sm text-text-muted">
                          {new Date(bid.timestamp).toLocaleString()}
                          {bid.bidder.verified && (
                            <span className="ml-2 text-green-600">✓ Verified</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary text-lg">{formatPrice(bid.amount)}</div>
                      {bid.id === biddingSession.currentHighestBid?.id && (
                        <div className="text-sm text-green-600 font-medium">Highest Bid</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bidding Panel */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-sm text-text-muted mb-2">Current Highest Bid</div>
                <div className="text-3xl font-bold text-primary mb-4">
                  {biddingSession.currentHighestBid ? formatPrice(biddingSession.currentHighestBid.amount) : formatPrice(biddingSession.minBidAmount)}
                </div>
                <div className="text-sm text-text-muted">
                  {biddingSession.bids.length} bid(s) placed
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-red-800 mb-1">Bidding ends in</div>
                  <div className="text-xl font-bold text-red-900">{timeLeft}</div>
                </div>
              </div>

              {/* Place Bid */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Your Bid Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newBidAmount}
                    onChange={(e) => setNewBidAmount(e.target.value)}
                    placeholder={`Min: ${minNextBid.toLocaleString()}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="text-sm text-text-muted mt-1">
                    Minimum bid: ₹{minNextBid.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={handlePlaceBid}
                  disabled={!newBidAmount || parseFloat(newBidAmount) < minNextBid}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Bid
                </button>

                <div className="text-xs text-text-muted text-center">
                  By placing a bid, you agree to our terms and conditions
                </div>
              </div>
            </div>

            {/* Bidding Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Bidding Rules:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Minimum increment: ₹{biddingSession.bidIncrement.toLocaleString()}</li>
                <li>• All bids are binding</li>
                <li>• Highest bidder wins</li>
                <li>• Payment due within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BiddingPage;