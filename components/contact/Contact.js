import React from 'react';
import ContactUs from './ContactUs';

import Link from 'next/link';

const Contact = () => {
  return (
    <section className="contact" id="contacto">
      <div className="">
        <div className="contact__container  grid">
          <div className="contact__content">
            <div className="contact__title text-black">
              Puedes contactarnos por WhatsApp o Email
            </div>
            <div className="contact__card">
              <h2 className="contact__card-title">WhatsApp</h2>
              <a
                className="contact__card-data"
                href=" https://wa.me/573044450405 "
                target="_blank"
              >
                304 445 0405
              </a>
            </div>

            <div className="contact__card">
              <h2 className="contact__card-title">Email</h2>
              <Link
                href="mailto:sujetadoreseasyhome@gmail.com"
                className="contact__card-data"
                target="_blank"
              >
                servicioalcliente@easyhome.com
              </Link>
            </div>
          </div>
          <ContactUs />
        </div>
      </div>
    </section>
  );
};

export default Contact;
