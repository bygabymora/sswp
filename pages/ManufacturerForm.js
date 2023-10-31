import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { BiMessageAdd } from 'react-icons/bi';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function ManufacturerForm() {
  const form = useRef();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [adress, setAdress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user_name', name);
    formData.append('user_email', email);
    formData.append('user_adress', adress);
    formData.append('phone', phone);
    formData.append('message', message);

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_w13byb7',
        form.current,
        'VGgpXukeMgVAWbiOf'
      )
      .then(
        (result) => {
          alert('Mensaje enviado, gracias por contactarnos');
          console.log('Email sent', result.text);
        },
        (error) => {
          console.log('Error sendingemail', error.text);
        }
      );

    setName('');
    setEmail('');
    setAdress('');
    setPhone('');
    setMessage('');
  };
  const tab = <>&nbsp;&nbsp;</>;

  return (
    <Layout title="Contraentrega">
      <h1 className="section__title">Contraentrega</h1>
      <div className="manufacturer__content">
        <h3 className="setion__text self-center text-center mb-3">
          Si deseas hacer algún cambio a tu orden, puedes enviarnos un mensaje
          por Whatsapp{' '}
          <Link
            className="font-bold underline"
            href="https://wa.me/573138125075"
          >
            3138125075
          </Link>{' '}
          o llena el siguiente formulario y nos contactaremos contigo lo más
          pronto posible.{' '}
          <span className="font-bold underline">
            (En cualquier momento puedes acceder a esta página de nuevo, desde
            la orden presionando el botón &quot;Editar Contraentrega&quot;)
          </span>
          , si tienes dudas, no dudes en contactarnos.
        </h3>

        <form
          className="manufacturer__form mt-9"
          ref={form}
          onSubmit={sendEmail}
        >
          <div className="manufacturer__form-div">
            <label className="manufacturer__form-tag">Nombre completo*</label>
            <input
              type="text"
              name="user_name"
              className="manufacturer__form-input"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>

          <div className="manufacturer__form-div">
            <label className="manufacturer__form-tag">Email*</label>
            <input
              type="email"
              name="user_email"
              className="manufacturer__form-input"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="manufacturer__form-div">
            <label className="manufacturer__form-tag">Teléfono</label>
            <input
              type="phone"
              name="user_phone"
              className="manufacturer__form-input"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          </div>
          <div className="manufacturer__form-div">
            <label className="manufacturer__form-tag">Dirección</label>
            <input
              type="address"
              name="user_adress"
              className="manufacturer__form-input "
              onChange={(e) => setAdress(e.target.value)}
              value={adress}
            />
          </div>

          <div className="manufacturer__form-div">
            <label className="manufacturer__form-tag">Anotaciones</label>
            <textarea
              name="message"
              className="manufacturer__form-input contact__message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              required
            />
          </div>

          <button
            className="button mb-4 button-flex rounded py-2 px-4 shadow outline-none hover:bg-gray-400 active:bg-gray-500 text-white w-full"
            type="submit"
            value="Send"
          >
            <span className="flex items-center justify-center text-white">
              Enviar {tab}
              <BiMessageAdd className="ml-2" />
            </span>
          </button>
        </form>
      </div>
    </Layout>
  );
}
