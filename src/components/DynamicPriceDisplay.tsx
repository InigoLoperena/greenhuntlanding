import React from 'react';
import { Badge } from './ui/badge';
import { Clock, TrendingDown } from 'lucide-react';
import { useDynamicPrice } from '@/hooks/useDynamicPrice';
import { formatPriceWithDiscount, formatTimeRemaining } from '@/utils/dynamicPricing';

interface DynamicPriceDisplayProps {
  createdAt: string;
  originalPrice: number;
  objectType: string;
}

export const DynamicPriceDisplay: React.FC<DynamicPriceDisplayProps> = ({
  createdAt,
  originalPrice,
  objectType
}) => {
  const priceInfo = useDynamicPrice(createdAt, originalPrice);

  if (objectType !== 'abandoned') {
    return <span className="text-lg font-bold text-primary">${originalPrice.toFixed(2)}</span>;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-primary">
          {formatPriceWithDiscount(priceInfo)}
        </span>
        {priceInfo.discountPercentage > 0 && !priceInfo.isFree && (
          <Badge variant="secondary" className="text-xs">
            <TrendingDown className="w-3 h-3 mr-1" />
            -{priceInfo.discountPercentage}%
          </Badge>
        )}
        {priceInfo.isFree && (
          <Badge variant="default" className="bg-green-500 text-white">
            FREE
          </Badge>
        )}
      </div>
      
      {!priceInfo.isFree && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Free in {formatTimeRemaining(priceInfo.timeRemaining)}</span>
        </div>
      )}
      
      {priceInfo.discountPercentage > 0 && !priceInfo.isFree && (
        <div className="text-xs text-muted-foreground">
          Original: ${priceInfo.originalPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
};