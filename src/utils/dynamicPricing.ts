// Dynamic pricing utility for abandoned objects
export interface DynamicPriceInfo {
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  isFree: boolean;
  secondsUntilNextDecrease: number;
}

export const PRICE_DECREASE_INTERVAL = 108; // seconds (1 minute 48 seconds)
export const TOTAL_FREE_TIME = 3 * 60 * 60; // 3 hours in seconds
export const LOW_PRICE_THRESHOLD = 0.10; // 10 cents - no commission threshold

export function calculateDynamicPrice(createdAt: string | Date, originalPrice: number): DynamicPriceInfo {
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - createdTime) / 1000);
  
  // If 3 hours have passed, it's free
  if (elapsedSeconds >= TOTAL_FREE_TIME) {
    return {
      currentPrice: 0,
      originalPrice,
      discountPercentage: 100,
      timeRemaining: { hours: 0, minutes: 0, seconds: 0 },
      isFree: true,
      secondsUntilNextDecrease: 0
    };
  }
  
  // Calculate how many price decreases have occurred
  const priceDecreases = Math.floor(elapsedSeconds / PRICE_DECREASE_INTERVAL);
  
  // Each decrease is 1% of original price
  const discountPercentage = Math.min(100, priceDecreases);
  
  // Calculate current price (never go below 0)
  const currentPrice = Math.max(0, originalPrice * (1 - discountPercentage / 100));
  
  // Calculate time remaining until free
  const remainingSeconds = TOTAL_FREE_TIME - elapsedSeconds;
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  
  // Calculate seconds until next price decrease
  const secondsInCurrentInterval = elapsedSeconds % PRICE_DECREASE_INTERVAL;
  const secondsUntilNextDecrease = PRICE_DECREASE_INTERVAL - secondsInCurrentInterval;
  
  return {
    currentPrice: Math.round(currentPrice * 100) / 100, // Round to 2 decimals
    originalPrice,
    discountPercentage,
    timeRemaining: { hours, minutes, seconds },
    isFree: currentPrice === 0,
    secondsUntilNextDecrease
  };
}

export function formatPriceWithDiscount(priceInfo: DynamicPriceInfo): string {
  if (priceInfo.isFree) {
    return "FREE";
  }
  
  if (priceInfo.discountPercentage > 0) {
    return `$${priceInfo.currentPrice.toFixed(2)} (-${priceInfo.discountPercentage}%)`;
  }
  
  return `$${priceInfo.currentPrice.toFixed(2)}`;
}

export function shouldApplyCommission(price: number): boolean {
  return price > LOW_PRICE_THRESHOLD;
}

export function formatTimeRemaining(timeRemaining: { hours: number; minutes: number; seconds: number }): string {
  const { hours, minutes, seconds } = timeRemaining;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}