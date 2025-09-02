import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { mockBiddingSessions } from '../utils/biddingData';
import { BiddingSession, Bid } from '../types/bidding';

const BiddingManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties } = useApp();
  const [biddingSession, setBiddingSession] = useState<BiddingSession | null>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [selectedBidder, setSelectedBidder] = useState<string | null>(null);

  const property = properties.find(p => p.id === id);

  useEffect(() => {
    if (id && mockBiddingSessions[id]) {
      setBiddingSession(mockBiddingSessions[id]);
    }
  }, [id]);

  useEffect(() => {
    if (!biddingSession || biddingSession.status === 'ended') return;

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
        setTimeLeft('Ended');
        setBiddingSession(prev => prev ? {...prev, status: 'ended'} : null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [biddingSession]);

  const handleCloseBidding = () => {
    if (biddingSession) {
      setBiddingSession({...biddingSession, status: 'ended'});
      // In real app: API call to close bidding
    }
  };

  const formatPrice = (price: number) => `₹${(price / 100000).toFixed(1)} Lakhs`;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!property || !biddingSession) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sortedBids = [...biddingSession.bids].sort((a, b) => b.amount - a.amount);

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
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(biddingSession.status)}`}>
              {biddingSession.status.charAt(0).toUpperCase() + biddingSession.status.slice(1)}
            </span>
            {biddingSession.status === 'active' && (
              <button
                onClick={handleCloseBidding}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Close Bidding
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-text-primary mb-2">{property.title}</h1>
                  <div className="flex items-center text-text-muted mb-2">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{property.address}, {property.city}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-text-muted">{property.bhk}</span>
                    <span className="text-text-muted">{property.area} sq ft</span>
                    <span className="text-text-muted capitalize">{property.type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Highest Bid Highlight */}
            {biddingSession.currentHighestBid && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Current Highest Bid</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {biddingSession.currentHighestBid.bidder.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{biddingSession.currentHighestBid.bidder.name}</div>
                        <div className="text-sm text-text-muted">
                          {new Date(biddingSession.currentHighestBid.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{formatPrice(biddingSession.currentHighestBid.amount)}</div>
                    <button
                      onClick={() => setSelectedBidder(biddingSession.currentHighestBid?.bidderId || null)}
                      className="mt-2 px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors text-sm"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* All Bidders */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">All Bidders ({sortedBids.length})</h3>
                <div className="text-sm text-text-muted">
                  Sorted by bid amount (highest first)
                </div>
              </div>
              
              <div className="space-y-3">
                {sortedBids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      bid.id === biddingSession.currentHighestBid?.id 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 bg-background-light'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-muted">#{index + 1}</span>
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                          {bid.bidder.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">{bid.bidder.name}</span>
                          {bid.bidder.verified && (
                            <span className="text-green-600 text-sm">✓ Verified</span>
                          )}
                          {bid.id === biddingSession.currentHighestBid?.id && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                              Highest
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-text-muted">
                          {new Date(bid.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-primary text-lg">{formatPrice(bid.amount)}</div>
                      </div>
                      <button
                        onClick={() => setSelectedBidder(bid.bidderId)}
                        className="px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors text-sm"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bidding Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="font-semibold text-text-primary mb-4">Bidding Overview</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Bids</span>
                  <span className="font-medium text-text-primary">{biddingSession.bids.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Starting Price</span>
                  <span className="font-medium text-text-primary">{formatPrice(property.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Min Bid Amount</span>
                  <span className="font-medium text-text-primary">{formatPrice(biddingSession.minBidAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Bid Increment</span>
                  <span className="font-medium text-text-primary">₹{biddingSession.bidIncrement.toLocaleString()}</span>
                </div>
              </div>

              {biddingSession.status === 'active' && timeLeft && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-yellow-800 mb-1">Bidding ends in</div>
                    <div className="text-lg font-bold text-yellow-900">{timeLeft}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Export Bid Report
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Contact All Bidders
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  View Property Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bidder Profile Modal */}
        {selectedBidder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              {(() => {
                const bidder = biddingSession.bids.find(b => b.bidderId === selectedBidder)?.bidder;
                return bidder ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-text-primary">Bidder Profile</h3>
                      <button
                        onClick={() => setSelectedBidder(null)}
                        className="text-text-muted hover:text-text-primary"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-text-muted">Name</label>
                        <div className="font-medium text-text-primary">{bidder.name}</div>
                      </div>
                      <div>
                        <label className="text-sm text-text-muted">Email</label>
                        <div className="font-medium text-text-primary">{bidder.email}</div>
                      </div>
                      <div>
                        <label className="text-sm text-text-muted">Phone</label>
                        <div className="font-medium text-text-primary">{bidder.phone}</div>
                      </div>
                      <div>
                        <label className="text-sm text-text-muted">Status</label>
                        <div className={`font-medium ${bidder.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                          {bidder.verified ? '✓ Verified' : '⚠ Pending Verification'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                        Contact Bidder
                      </button>
                      <button
                        onClick={() => setSelectedBidder(null)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-text-secondary rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BiddingManagement;