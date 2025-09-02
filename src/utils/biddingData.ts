import { BiddingSession, Bid, Bidder } from '../types/bidding';

const mockBidders: Bidder[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@email.com',
    phone: '+91 98765 43210',
    verified: true
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@email.com',
    phone: '+91 87654 32109',
    verified: true
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@email.com',
    phone: '+91 76543 21098',
    verified: false
  }
];

export const mockBiddingSessions: Record<string, BiddingSession> = {
  '1': {
    id: 'bid-1',
    propertyId: '1',
    startTime: '2024-01-20T10:00:00Z',
    endTime: '2024-01-25T18:00:00Z',
    minBidAmount: 8000000,
    bidIncrement: 50000,
    status: 'active',
    bids: [
      {
        id: 'bid-1-1',
        bidderId: '1',
        bidder: mockBidders[0],
        amount: 8200000,
        timestamp: '2024-01-20T14:30:00Z',
        status: 'active'
      },
      {
        id: 'bid-1-2',
        bidderId: '2',
        bidder: mockBidders[1],
        amount: 8350000,
        timestamp: '2024-01-21T09:15:00Z',
        status: 'active'
      },
      {
        id: 'bid-1-3',
        bidderId: '3',
        bidder: mockBidders[2],
        amount: 8500000,
        timestamp: '2024-01-21T16:45:00Z',
        status: 'active'
      }
    ],
    currentHighestBid: {
      id: 'bid-1-3',
      bidderId: '3',
      bidder: mockBidders[2],
      amount: 8500000,
      timestamp: '2024-01-21T16:45:00Z',
      status: 'active'
    }
  }
};