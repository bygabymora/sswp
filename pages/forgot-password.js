import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

import { toast } from 'react-toastify';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import emailjs from '@emailjs/browser';

export default function ForgotPassword() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const form = useRef();
  const generatePassword = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&';
    let password = '';
    while (!/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@$!%*?&]+$/.test(password)) {
      password = '';
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return password;
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const newPassword = generatePassword();
    setPassword(newPassword); // This sets the state, but it's asynchronous

    form.current.user_code.value = newPassword;

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_r8ylan9',
        form.current,
        'LuJZSocJe5a_St7dQ'
      )
      .then(
        (result) => {
          toast.success(
            'Te hemos enviado un email con un código para recuperar tu contraseña'
          );
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    setEmail('');

    updateUserPassword(newPassword);
  };

  const updateUserPassword = async (newPassword) => {
    try {
      const response = await fetch('/api/auth/recovery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: newPassword,
          isPasswordReset: true,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      toast.success('Código enviado con éxito.'); // Show success message
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Error al enviar el código.'); // Show error message
    }
  };

  const submitHandler = (e) => {
    sendEmail(e);
    router.push('/Recovery');
  };

  return (
    <Layout title="Recuperación de cuenta">
      <form className="mx-2 pr-5" ref={form} onSubmit={submitHandler}>
        <h1 className="mb-1 text-xl font-bold">Recuperacion de contraseña</h1>
        <div className="mb-4">
          ¿No tienes una cuenta? &nbsp;
          <Link
            href="/Register"
            className="font-bold underline active:text-gray-700"
          >
            Regístrate
          </Link>
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-lg font-bold text-gray-700"
            htmlFor="email"
          >
            Ingresa tu Email
          </label>
          <input
            type="email"
            name="user_email"
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            aria-label="Email"
            required
          />
        </div>
        <div className="mb-4 hidden">
          <label
            className="block mb-2 text-lg font-bold text-gray-700"
            htmlFor="password"
          />
          <input
            type="email"
            name="user_code"
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            value={password}
            aria-label="Email"
            required
            readOnly
          />
        </div>

        <div className="mb-4">
          <button className="primary-button" type="submit">
            Enviar
          </button>
        </div>
      </form>
    </Layout>
  );
}
