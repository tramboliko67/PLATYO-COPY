import React, { useRef, useEffect, useState } from 'react';

interface AnimatedCarouselProps {
  images: string[];
  primaryColor: string;
  textColor: string;
  fontFamily?: string;
}

export const AnimatedCarousel: React.FC<AnimatedCarouselProps> = ({
  images,
  primaryColor,
  textColor,
  fontFamily = 'Inter',
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

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${BACKDROP_HEIGHT + 350}px` }}>
      {/* Backdrop Images */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ height: `${BACKDROP_HEIGHT}px` }}
      >
        {images.map((image, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const opacity = Math.max(
            0,
            1 - Math.abs((scrollX - index * CARD_WIDTH) / CARD_WIDTH)
          );

          return (
            <img
              key={index}
              src={image}
              alt={`Backdrop ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity }}
            />
          );
        })}

        {/* Gradient Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: `${BACKDROP_HEIGHT}px`,
            background: 'linear-gradient(to bottom, transparent, white)',
          }}
        />
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
        {images.map((image, index) => {
          const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            (index + 1) * CARD_WIDTH,
          ];

          const translateY = Math.min(
            0,
            -50 * (1 - Math.abs((scrollX - index * CARD_WIDTH) / CARD_WIDTH))
          );

          return (
            <div
              key={index}
              className="flex-shrink-0 snap-center"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div
                className="mx-2 p-2 rounded-3xl bg-white shadow-xl flex flex-col items-center transition-transform duration-300"
                style={{
                  transform: `translateY(${translateY}px)`,
                }}
              >
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full rounded-2xl mb-2"
                  style={{
                    height: `${CARD_WIDTH * 1.2}px`,
                    objectFit: 'cover',
                  }}
                />
                <h3
                  className="font-bold text-2xl"
                  style={{
                    color: textColor,
                    fontFamily,
                  }}
                >
                  Título
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
