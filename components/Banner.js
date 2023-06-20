import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Banner1 from '../public/images/assets/banner1.png';
import Banner2 from '../public/images/assets/banner2.png';
import Banner3 from '../public/images/assets/banner3.png';

const Banner = () => {
  const [audience, setAudience] = useState('');

  const handleAudienceSelection = (selectedAudience) => {
    setAudience(selectedAudience);
  };

  useEffect(() => {
    const imageContainer = document.querySelector('.image-container');
    imageContainer.classList.add('fade-in-right');

    const animationDuration = 1000; // Duration of the fade-in animation in milliseconds
    setTimeout(() => {
      imageContainer.classList.remove('fade-in-right');
    }, animationDuration);
  }, [audience]);

  const handleCallButtonClick = () => {
    window.location.href = 'tel:8132520727'; // Replace with your phone number
  };

  return (
    <div className="text-title-color-dark text-center ">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 banner-container mx-auto px-4 py-8 items-center">
        <div className="">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to STAT Surgical Supplies
          </h1>
          <p className="text-lg text-text-color">
            {audience === 'hospital' ? (
              <>
                We provide high-quality surgical supplies to meet the needs of
                healthcare professionals. Partner with us to ensure top-notch
                care for your patients.
              </>
            ) : audience === 'manufacturer' ? (
              <>
                Join forces with us to expand your market reach and deliver your
                high-quality surgical supplies to hospitals and healthcare
                providers.
              </>
            ) : (
              <>
                Welcome to our Surgical Supplies store. Explore our wide range
                of high-quality surgical supplies.
              </>
            )}
          </p>
          {audience !== '' && (
            <div className="grid grid-cols-2 mt-8 w-full mb-8 text-center">
              <button
                href="tel:8132520727"
                onClick={handleCallButtonClick}
                className="equal-button-size btn-call sm:inline-block block mr-4 mb-4 sm:mb-0 text-white bg-title-color-dark hover:bg-title-color px-6 py-3 rounded"
              >
                Call Now
              </button>
              <button
                href="#contact"
                className=" equal-button-size btn-contact sm:inline-block block text-title-color-dark hover:text-title-color px-6 py-3 rounded "
              >
                Contact Us
              </button>
            </div>
          )}
          {audience === '' && (
            <div>
              <h1 className="text-2xl">Who are you?</h1>
              <br />
              <div className="grid grid-cols-2 cart-button items-center mb-8 text-center">
                <button
                  onClick={() => handleAudienceSelection('hospital')}
                  className="btn-audience equal-button-size sm:inline-block block mr-4 mb-4 sm:mb-0 text-white bg-title-color-dark hover:bg-title-color px-6 py-3 rounded md:text-sm text-center"
                >
                  Hospital or Health Supplier
                </button>
                <button
                  onClick={() => handleAudienceSelection('manufacturer')}
                  className="btn-audience equal-button-size sm:inline-block block mr-4 mb-4 sm:mb-0 text-white bg-title-color-dark hover:bg-title-color px-6 py-3 rounded md:text-sm text-center"
                >
                  Surgical Supplies Manufacturer
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="image-container">
          {audience === 'hospital' ? (
            <Image
              className="image-container-image"
              src={Banner2}
              alt="Banner"
            />
          ) : audience === 'manufacturer' ? (
            <Image
              className="image-container-image"
              src={Banner3}
              alt="Banner"
            />
          ) : (
            <Image
              className="image-container-image"
              src={Banner1}
              alt="Banner"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
