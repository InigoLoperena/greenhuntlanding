import { useState, useEffect } from 'react';
import { calculateDynamicPrice, DynamicPriceInfo } from '@/utils/dynamicPricing';

export function useDynamicPrice(createdAt: string | Date, originalPrice: number) {
  const [priceInfo, setPriceInfo] = useState<DynamicPriceInfo>(() => 
    calculateDynamicPrice(createdAt, originalPrice)
  );

  useEffect(() => {
    const updatePrice = () => {
      const newPriceInfo = calculateDynamicPrice(createdAt, originalPrice);
      setPriceInfo(newPriceInfo);
    };

    // Update immediately
    updatePrice();

    // Set up interval to update every second for real-time countdown
    const interval = setInterval(updatePrice, 1000);

    return () => clearInterval(interval);
  }, [createdAt, originalPrice]);

  return priceInfo;
}