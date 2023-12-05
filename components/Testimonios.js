import React, { useCallback } from 'react';
import data from '../utils/data.js';
import Testimonio from './Testimonio';
import { BiSkipNextCircle, BiSkipPreviousCircle } from 'react-icons/bi';

function Carousel() {
  const { testimonios } = data;
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [totalSlides] = React.useState(testimonios.length);

  const prevSlide = () => {
    setCurrentSlide((oldSlide) =>
      oldSlide === 0 ? totalSlides - 1 : oldSlide - 1
    );
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((oldSlide) =>
      oldSlide === totalSlides - 1 ? 0 : oldSlide + 1
    );
  }, [totalSlides]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="carousel-container" lang="en">
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className="w-full mt-3 flex flex-row items-center justify-center"
      >
        <BiSkipPreviousCircle className="text-lg" />
        &nbsp;Previo
      </button>
      <div className="carousel-items w-full mt-3 flex flex-row items-center justify-center mb-2">
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
        className="w-full mt-5 flex flex-row items-center justify-center mb-2"
      >
        Siguiente &nbsp;
        <BiSkipNextCircle className="text-lg" />
      </button>
    </div>
  );
}

export default function Testimonios({ testimonios }) {
  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center w-full">
          <Carousel testimonios={testimonios} className="w-full" />
        </div>
      </div>
    </section>
  );
}
