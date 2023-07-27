import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { BiMessageAdd } from 'react-icons/bi';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function ManufacturerForm() {
  const form = useRef();
  const fileInputRef = useRef(); // Add a separate ref for the file input

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState([]);

  const sendEmail = (e) => {
    e.preventDefault();

    const fileInput = fileInputRef.current.files[0];

    if (fileInput) {
      const formData = new FormData();
      formData.append('user_name', name);
      formData.append('user_email', email);
      formData.append('company', company);
      formData.append('phone', phone);
      formData.append('message', message);
      formData.append('my_file', fileInput);

      emailjs
        .sendForm(
          'service_ej3pm1k',
          'template_6uwfj0h',
          form.current,
          'cKdr3QndIv27-P67m'
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
      setCompany('');
      setPhone('');
      setMessage('');
      setFile('');
    } else {
      alert('Selecciona un archivo');
    }
  };
  const tab = <>&nbsp;&nbsp;</>;

  return (
    <Layout title="Nequi-Daviplata">
      <h1 className="section__title">Nequi-Daviplata</h1>
      <div className="card mb-3">
        <p className="setion__text self-center text-center mb-3">
          Puedes realizar el pago por Nequi o Daviplata al siguiente número:
        </p>
        <p className="setion__text font-bold underline self-center text-center">
          313 8125075
        </p>
        <br />
      </div>
      <div className="manufacturer__content">
        <h3 className="setion__text self-center text-center mb-3">
          Por favor llena el siguiente formulario cuando realices el pago, o
          envía el comprobante al WhatApp{' '}
          <Link
            className="font-bold underline"
            href="https://wa.me/573138125075"
          >
            3138125075
          </Link>{' '}
          y nos contactaremos contigo lo más pronto posible.{' '}
          <span className="font-bold underline">
            (En cualquier momento puedes acceder a esta página de nuevo, desde
            la orden presionando el botón Nequi-Daviplata)
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
            <label className="manufacturer__form-tag">Fecha del pago</label>
            <input
              type="date"
              name="user_company"
              className="manufacturer__form-input "
              onChange={(e) => setCompany(e.target.value)}
              value={company}
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

          <div className="manufacturer__form-div">
            <label className="manufacturer__form-tag">
              Comprobante del pago
            </label>
            <input
              type="file"
              name="my_file"
              onChange={(e) => setFile(e.target.value)}
              className="manufacturer__form-input"
              ref={fileInputRef}
              value={file}
            />
          </div>

          <button
            className="button button-flex rounded py-2 px-4 shadow outline-none hover:bg-gray-400 active:bg-gray-500 text-white w-full"
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
