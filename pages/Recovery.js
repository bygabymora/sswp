import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { getError } from '../utils/error';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Recovery() {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({ email: '', password: '' });
  }, [reset]);

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const submitHandler2 = async (e) => {
    e.preventDefault();
    const formData = getValues();
    try {
      const email = session.user.email;
      await axios.put('/api/auth/update', {
        email,
        password: formData.password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password: formData.password,
      });
      toast.success('Contraseña actualizada exitosamente');
      router.push('/');
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Recuperación de cuenta">
      <form
        className="mx-2 pr-5"
        onSubmit={!session ? handleSubmit(submitHandler) : submitHandler2}
      >
        {!session && (
          <h1 className="mb-1 text-xl font-bold">
            Ingresa el código que enviamos a tu correo.
          </h1>
        )}
        {session && (
          <h1 className="mb-1 text-xl font-bold">
            Bienvenido nuevamente {session.user.name}
            <br />
            Ingresa tu nueva contraseña.
          </h1>
        )}
        <div className={` ${!session ? 'block' : 'hidden'} mb-2`}>
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            autoFocus
            id="email"
            type="email"
            {...register('email', {
              required: 'Por favor ingresa tu Email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i,
                message: 'Email invalido',
              },
            })}
            placeholder="Email"
          ></input>
          {errors.email && (
            <div className="text-blue-950">{errors.email.message}</div>
          )}
        </div>
        {!session && (
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Código
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              autoFocus
              id="password"
              type="password"
              {...register('password', {
                required: 'Por favor ingresa tu contraseña',
                minLength: {
                  value: 8,
                  message: 'Contraseña debe tener al menos 8 caracteres',
                },
                validate: (value) =>
                  /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d@$!%*?&]+$/.test(value) ||
                  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
              })}
              placeholder="Contraseña"
            />

            {errors.password && (
              <div className="text-blue-950">{errors.password.message}</div>
            )}
          </div>
        )}

        {session && (
          <div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                Nueva contraseña
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="password"
                id="password"
                {...register('password', {
                  required: 'Please enter new password',
                  minLength: {
                    value: 6,
                    message: 'password is more than 5 chars',
                  },
                })}
              />
              {errors.password && (
                <div className="text-red-500 ">{errors.password.message}</div>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirma nueva contraseña
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm new password',
                  validate: (value) => value === getValues('password'),
                  minLength: {
                    value: 6,
                    message: 'Contraseña es mayor a 5 caracteres',
                  },
                })}
              />
              {errors.confirmPassword && (
                <div className="text-red-500 ">
                  {errors.confirmPassword.message}
                </div>
              )}
              {errors.confirmPassword &&
                errors.confirmPassword.type === 'validate' && (
                  <div className="text-red-500 ">Password do not match</div>
                )}
            </div>
          </div>
        )}
        {!session && (
          <div className="mb-4">
            <button className="primary-button" type="submit">
              Enviar
            </button>
          </div>
        )}
        {session && (
          <div className="mb-4">
            <button className="primary-button" type="submit">
              Enviar
            </button>
          </div>
        )}
      </form>
    </Layout>
  );
}
