import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { BiMessageAdd } from 'react-icons/bi';

const ContactUs = () => {
  const form = useRef();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_gatpcjr',
        form.current,
        'LuJZSocJe5a_St7dQ'
      )
      .then(
        (result) => {
          alert('Mensaje enviado, gracias por contactarnos');
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
    setName('');
    setEmail('');
    setMessage('');
  };
  const tab = <>&nbsp;&nbsp;</>;

  return (
    <div className="contact__content">
      <h3 className="contact__title">ó, enviarnos un mensaje</h3>

      <form className="contact__form" ref={form} onSubmit={sendEmail}>
        <div className="contact__form-div">
          <label className="contact__form-tag " aria-label="Nombre">
            Nombre*
          </label>
          <input
            type="text"
            name="user_name"
            className="contact__form-input"
            onChange={(e) => setName(e.target.value)}
            value={name}
            aria-label="Nombre"
            required
          />
        </div>

        <div className="contact__form-div">
          <label className="contact__form-tag" aria-label="Email">
            Email*
          </label>
          <input
            type="email"
            name="user_email"
            className="contact__form-input"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            aria-label="Email"
            required
          />
        </div>

        <div className="contact__form-div">
          <label className="contact__form-tag" aria-label="Mensaje">
            Mensaje*
          </label>
          <textarea
            name="message"
            className="contact__form-input contact__message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            aria-label="Mensaje"
            required
          />
        </div>
        <button className="button button--flex btn-contact">
          <span className=" text-white">Enviar {tab} </span>
          <BiMessageAdd className=" text-white" />
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
