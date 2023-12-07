import React, { useCallback, useState, useEffect } from 'react';
import data from '../utils/data.js';
import Testimonio from './Testimonio';
import { BiSkipNextCircle, BiSkipPreviousCircle } from 'react-icons/bi';

function Carousel() {
  const { testimonios } = data;
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = testimonios.length;
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((oldSlide) =>
      oldSlide === 0 ? totalSlides - 1 : oldSlide - 1
    );
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((oldSlide) =>
      oldSlide === totalSlides - 1 ? 0 : oldSlide + 1
    );
  }, [totalSlides]);

  useEffect(() => {
    if (isInteracting) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isInteracting]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    handleInteractionStart();
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 75) {
      nextSlide();
    } else if (touchEndX - touchStartX > 75) {
      prevSlide();
    }
    handleInteractionEnd();
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setMouseStartX(e.clientX);
    setIsDragging(true);
    handleInteractionStart();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dragDelta = mouseStartX - e.clientX;
    if (dragDelta > 75) {
      nextSlide();
    } else if (dragDelta < -75) {
      prevSlide();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleInteractionEnd();
  };
  return (
    <div className="" lang="en">
      <div>
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-full mt-3 flex flex-row items-center justify-center my-2"
        >
          <BiSkipPreviousCircle className="text-lg" />
          &nbsp;Previo
        </button>
        <div
          className="carousel-items2 "
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={() => {
            handleMouseUp();
            handleInteractionEnd();
          }}
        >
          <div
            className="carousel-item2 px-3 lg:px-0"
            key={testimonios[currentSlide].id}
          >
            <Testimonio testimonio={testimonios[currentSlide]} />
          </div>
        </div>
        <button
          onClick={nextSlide}
          disabled={currentSlide >= totalSlides - 1}
          className="w-full mt-5 flex flex-row items-center justify-center my-2 "
        >
          Siguiente &nbsp;
          <BiSkipNextCircle className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default function Testimonios({ testimonios }) {
  return (
    <section className="bg-white">
      <div className="mx-auto">
        <div className="flex flex-col items-center justify-center w-full">
          <Carousel testimonios={testimonios} className="w-full" />
        </div>
      </div>
    </section>
  );
}
