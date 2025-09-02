export interface Bidder {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
}

export interface Bid {
  id: string;
  bidderId: string;
  bidder: Bidder;
  amount: number;
  timestamp: string;
  status: 'active' | 'withdrawn' | 'accepted';
}

export interface BiddingSession {
  id: string;
  propertyId: string;
  startTime: string;
  endTime: string;
  minBidAmount: number;
  bidIncrement: number;
  status: 'upcoming' | 'active' | 'ended';
  bids: Bid[];
  currentHighestBid?: Bid;
}