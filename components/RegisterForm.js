import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function RegisterForm({ signIn, getError }) {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Registro exitoso');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <form
      className="mx-auto max-w-screen-md"
      onSubmit={handleSubmit(submitHandler)}
    >
      <h1 className="mb-1 text-xl font-bold">Crea una cuenta</h1>
      <div className="mb-4 ">
        ¿Ya tienes una cuenta? &nbsp;
        <Link
          href="/Login"
          className="font-bold underline active:text-gray-700"
        >
          Ingresa
        </Link>
      </div>
      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="name"
        >
          Nombre completo
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="name"
          autoFocus
          {...register('name', {
            required: 'Por favor ingresa el nombre completo',
          })}
        />
        {errors.name && (
          <div className="text-red-500">{errors.name.message}</div>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          {...register('email', {
            required: 'Por favor ingresa el Email',
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
              message: 'Please enter valid email',
            },
          })}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="email"
        ></input>
        {errors.email && (
          <div className="text-red-500">{errors.email.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="password"
        >
          Contraseña
        </label>
        <input
          type="password"
          {...register('password', {
            required: 'Por favor ingresa la contraseña',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres',
            },
            pattern: {
              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
              message:
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial',
            },
          })}
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="password"
          autoFocus
        ></input>
        {errors.password && (
          <div className="text-red-500 ">{errors.password.message}</div>
        )}
      </div>
      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="confirmPassword"
        >
          Confirma la contraseña
        </label>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          type="password"
          id="confirmPassword"
          {...register('confirmPassword', {
            required: 'Por favor confirma la contraseña',
            validate: (value) => value === getValues('password'),
            minLength: {
              value: 6,
              message: 'Confirma la contraseña',
            },
          })}
        />
        {errors.confirmPassword && (
          <div className="text-red-500 ">{errors.confirmPassword.message}</div>
        )}
        {errors.confirmPassword &&
          errors.confirmPassword.type === 'validate' && (
            <div className="text-red-500 ">Las contraseñas no son iguales</div>
          )}
      </div>
      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="terms"
        >
          Acepto los términos, condiciones y política de tratamiento de datos.
        </label>
        <input
          type="checkbox"
          className="border-gray-300 rounded-sm"
          id="terms"
          required
        />
      </div>

      <div className="mb-4 ">
        <button className="primary-button">Regístrate</button>
      </div>
    </form>
  );
}
