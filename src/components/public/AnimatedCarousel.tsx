import React, { useRef, useEffect, useState } from 'react';
import { Product } from '../../types';

interface AnimatedCarouselProps {
  products: Product[];
  primaryColor: string;
  textColor: string;
  cardBackgroundColor?: string;
  fontFamily?: string;
  onProductClick?: (product: Product) => void;
}

export const AnimatedCarousel: React.FC<AnimatedCarouselProps> = ({
  products,
  primaryColor,
  textColor,
  cardBackgroundColor = '#ffffff',
  fontFamily = 'Inter',
  onProductClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (scrollContainerRef.current) {
        const width = window.innerWidth;
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollX(e.currentTarget.scrollLeft);
  };

  const CARD_WIDTH = containerWidth * 0.7;
  const SPACING = (containerWidth - CARD_WIDTH) / 2;
  const BACKDROP_HEIGHT = window.innerHeight * 0.5;

  if (products.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${BACKDROP_HEIGHT + 450}px` }}>
        <p
          className="text-xl mb-2 opacity-70"
          style={{
            color: textColor,
            fontFamily: theme.primary_font || 'Inter'
          }}
        >
          Te presentamos nuestros
        </p>
        <h2
          className="text-5xl font-bold mb-2"
          style={{
            color: textColor,
            fontFamily: theme.secondary_font || 'Poppins'
          }}
        >
          destacados
        </h2>
        <div className="flex items-left justify-left gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className="w-5 h-5 fill-current" style={{ color: secondaryColor }} />
          ))}
        </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="absolute top-0 left-0 right-0 flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
        style={{
          paddingTop: '200px',
          paddingLeft: `${SPACING}px`,
          paddingRight: `${SPACING}px`,
          scrollSnapType: 'x mandatory',
        }}
      >
        {products.map((product, index) => {
          const translateY = Math.min(
            0,
            -50 * (1 - Math.abs((scrollX - index * CARD_WIDTH) / CARD_WIDTH))
          );

          const minPrice = product.variations.length > 0
            ? Math.min(...product.variations.map(v => v.price))
            : 0;

          return (
            <div
              key={product.id}
              className="flex-shrink-0 snap-center"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div
                className="mx-2 p-2 rounded-3xl shadow-xl flex flex-col items-center transition-transform duration-300 cursor-pointer hover:shadow-2xl"
                style={{
                  transform: `translateY(${translateY}px)`,
                  backgroundColor: cardBackgroundColor,
                }}
                onClick={() => onProductClick && onProductClick(product)}
              >
                <img
                  src={product.images[0] || ''}
                  alt={product.name}
                  className="w-full rounded-2xl mb-2"
                  style={{
                    height: `${CARD_WIDTH * 1.2}px`,
                    objectFit: 'cover',
                  }}
                />
                <h3
                  className="font-bold text-2xl mb-1"
                  style={{
                    color: textColor,
                    fontFamily,
                  }}
                >
                  {product.name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
