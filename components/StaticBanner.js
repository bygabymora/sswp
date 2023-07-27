import Link from 'next/link';
import React from 'react';
import { AiOutlineSend } from 'react-icons/ai';

const StaticBanner = () => {
  return (
    <div className="static-banner-container mt-4">
      <div className="banner-content">
        <h2 className="banner-title">
          Averigua porque nuestros clientes nos prefieren
        </h2>
        <p className="banner-description">
          Sujetadores para sábanas de calidad y comodidad insuperables.
        </p>
        <Link className="flex justify-center items-center" href="/products">
          <span className="banner-link">
            ¡Mejora tus noches de descanso ahora!
          </span>
          <span className="link-space">&nbsp;&nbsp;</span>
          <AiOutlineSend className="link-space" />
        </Link>
      </div>
    </div>
  );
};

export default StaticBanner;
