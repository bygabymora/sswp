import Layout from '../components/Layout.js';
import { ProductItem } from '../components/ProductItem.js';

import React from 'react';
import Banner from '../components/Banner';
import Contact from '../components/contact/Contact';
import StaticBanner from '../components/StaticBanner';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Product from '../models/Product.js';
import db from '../utils/db.js';
import Testimonios from '../components/Testimonios.js';
import { BiSkipNextCircle, BiSkipPreviousCircle } from 'react-icons/bi';

function Carousel({ products }) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [visibleItems, setVisibleItems] = React.useState(3);
  const [totalSlides, setTotalSlides] = React.useState(7); // default to a larger screen size
  const [touchStartX, setTouchStartX] = React.useState(0);
  const [touchEndX, setTouchEndX] = React.useState(0);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [mouseStartX, setMouseStartX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    handleInteractionStart(); // Added this line
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
    handleInteractionEnd(); // Added this line
  };

  let interactionEndTimer = null; // Declare at the top of the Carousel component

  const handleInteractionStart = () => {
    // Clear any existing timer when a new interaction starts
    if (interactionEndTimer) {
      clearTimeout(interactionEndTimer);
    }
    setIsInteracting(true);
  };

  const handleInteractionEnd = () => {
    // Set a timer to stop the interaction state after a delay
    interactionEndTimer = setTimeout(() => {
      setIsInteracting(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 768) {
        setTotalSlides(8);
      } else {
        setTotalSlides(6);
      }
    }
  }, []);

  const prevSlide = () => {
    setCurrentSlide((oldSlide) => Math.max(oldSlide - 1, 0));
  };

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((oldSlide) => {
      if (oldSlide + 1 < totalSlides) {
        return oldSlide + 1;
      } else {
        return 0;
      }
    });
  }, [totalSlides]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleItems(1);
      } else {
        setVisibleItems(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (isInteracting) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide, isInteracting]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setMouseStartX(e.clientX);
    setIsDragging(true);
    handleInteractionStart(); // Added this line
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
    handleInteractionEnd(); // Added this line
  };

  const handleOnMouseLeave = () => {
    handleInteractionEnd();
    handleMouseUp();
  };

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
      <div
        className="carousel-items surface h-[26rem] md:h-[26rem] lg:h-[28rem] 2xl:h-[25rem] xl:h-[30rem] sm:h-[26rem]"
        style={{
          transform: `translateX(-${currentSlide * (100 / visibleItems)}%)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleOnMouseLeave} // using combined function here
      >
        {products.map((product) => (
          <div className="carousel-item px-3 lg:px-0" key={product.slug}>
            <ProductItem product={product} />
          </div>
        ))}
      </div>
      <button
        onClick={nextSlide}
        disabled={currentSlide >= totalSlides - 1}
        className="w-full mt-5 flex flex-row items-center justify-center"
      >
        Siguiente &nbsp;
        <BiSkipNextCircle className="text-lg" />
      </button>
    </div>
  );
}

export default function Home({ products }) {
  return (
    <Layout title="Home Page">
      <StaticBanner />
      <Banner />

      <h2 className="section__title my-2" id="productos">
        Nuestros Productos
      </h2>
      <div>
        <p className="text-center text-sm md:text-lg">
          ¡Escoje los sujetadores que más se adapten a ti!
        </p>
      </div>

      <Carousel products={products} />

      <Testimonios />

      <Contact className="mt-2" />
    </Layout>
  );
}
export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
