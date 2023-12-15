import Link from 'next/link';
import React from 'react';
import { FaArrowCircleDown } from 'react-icons/fa';
import { useRouter } from 'next/router';

const StaticBanner = () => {
  const router = useRouter();
  const handleLinkClick = (section) => {
    if (window.innerWidth >= 800) {
      const yOffsetLargeScreen = -100;
      setTimeout(() => {
        const element = document.getElementById(section);
        const y =
          element.getBoundingClientRect().top +
          window.scrollY +
          yOffsetLargeScreen;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 200);
    } else {
      const yOffsetSmallScreen = -100;
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
    <div className="static-banner-container md:mt-10 mt-3">
      <div className="banner-content">
        <h1 className="banner-title">
          ¡Con más de 20 años de experiencia en el mercado!
          <br />
          <span className="font-normal">Industria 100% COLOMBIANA</span>
        </h1>

        <p className="banner-description font-bold text-[2rem]">
          ¡Todas las órdenes mayores de $70.000 tienen envío GRATIS!
        </p>
        <Link
          className="flex justify-center items-center"
          href="/#productos"
          onClick={() => handleLinkClick('productos')}
        >
          <span className="banner-link">
            ¡Mejora tus noches de descanso ahora!
          </span>
          <span className="link-space">&nbsp;&nbsp;</span>
          <FaArrowCircleDown className="link-space" />
        </Link>
      </div>
    </div>
  );
};

export default StaticBanner;
