import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars = ({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  interactive = false, 
  onRatingChange,
  className 
}: RatingStarsProps) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        const isPartiallyFilled = rating > index && rating < starRating;
        
        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              'transition-colors',
              {
                'text-yellow-500 fill-yellow-500': isFilled,
                'text-yellow-500 fill-yellow-300': isPartiallyFilled,
                'text-muted-foreground': !isFilled && !isPartiallyFilled,
                'cursor-pointer hover:text-yellow-400': interactive,
              }
            )}
            onClick={interactive ? () => handleStarClick(starRating) : undefined}
          />
        );
      })}
    </div>
  );
};