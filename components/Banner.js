import React from 'react';
import Image from 'next/image';
import Banner1 from '../public/images/assets/banner1.png';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Banner = () => {
  const router = useRouter();

  const handleCallButtonClick = () => {
    window.location.href = 'tel:8132520727';
  };

  const handleLinkClick = (section) => {
    if (window.innerWidth >= 800) {
      const yOffsetLargeScreen = -170;
      setTimeout(() => {
        const element = document.getElementById(section);
        const y =
          element.getBoundingClientRect().top +
          window.scrollY +
          yOffsetLargeScreen;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 200);
    } else {
      const yOffsetSmallScreen = -50;
      setTimeout(() => {
        const path = `/#${section}`; // Construct anchor link with #
        router.push(path);
        const element = document.getElementById(section);
        const y =
          element.getBoundingClientRect().top +
          window.scrollY +
          yOffsetSmallScreen;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 200);
    }
  };

  return (
    <div className="text-title-color-dark text-center ">
      <div className="grid lg:grid-cols-2 md:grid-cols-1  banner-container mx-auto px-4 py-8 items-center">
        <div className="">
          <h1 className="text-4xl font-bold mb-4">
            Transforma tu cama en un oasis de comodidad
          </h1>
          <p className="text-lg text-text-color">¡Aqui te contamos como!</p>

          <div className="grid grid-cols-2 mt-8 w-full mb-8 text-center">
            <button
              href="tel:8132520727"
              onClick={handleCallButtonClick}
              className="equal-button-size btn-call sm:inline-block block mr-4 mb-4 sm:mb-0 text-white bg-title-color-dark hover:bg-title-color px-6 py-3 rounded lg:hidden"
            >
              Llámanos
            </button>
            <Link
              href="#contact"
              className=" equal-button-size btn-contact hover:text-white sm:inline-block block px-6 py-3 rounded lg:text-center"
              onClick={() => handleLinkClick('contact')}
            >
              Contáctanos
            </Link>
          </div>
        </div>
        <Image
          className="image-container-image fade-in-right"
          src={Banner1}
          alt="Banner"
        />
      </div>
    </div>
  );
};

export default Banner;
