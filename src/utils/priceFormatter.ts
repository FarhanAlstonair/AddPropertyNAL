export const formatIndianPrice = (price: number, listingIntent?: string): string => {
  if (listingIntent === 'rent') {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lakh/month`;
    }
    return `₹${price.toLocaleString('en-IN')}/month`;
  }
  
  if (price >= 10000000) { // 1 Crore or more
    return `₹${(price / 10000000).toFixed(1)} Crore`;
  } else if (price >= 100000) { // 1 Lakh or more
    return `₹${(price / 100000).toFixed(1)} Lakh`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
};