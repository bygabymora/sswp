import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { getError } from '../utils/error';
import Mercadopago from '../public/images/mercadopago2.svg';
import Contraentrega from '../public/images/Contraentrega.svg';
import { toast } from 'react-toastify';
import { FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function ShippingScreen() {
  const usStates = [
    'Amazonas',
    'Antioquia',
    'Arauca',
    'Atlántico',
    'Bogotá D.C.',
    'Bolívar',
    'Boyacá',
    'Caldas',
    'Caquetá',
    'Casanare',
    'Cauca',
    'Cesar',
    'Chocó',
    'Córdoba',
    'Cundinamarca',
    'Guainía',
    'Guaviare',
    'Huila',
    'La Guajira',
    'Magdalena',
    'Meta',
    'Nariño',
    'Norte de Santander',
    'Putumayo',
    'Quindío',
    'Risaralda',
    'San Andrés y Providencia',
    'Santander',
    'Sucre',
    'Tolima',
    'Valle del Cauca',
    'Vaupés',
    'Vichada',
  ];

  const [filteredStates, setFilteredStates] = useState(usStates);
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false); // Add state for tracking the visibility of suggestions

  const [selectedSuggestion, setSelectedSuggestion] = useState(-1); // Initialize to -1, meaning no suggestion is selected
  const [lastOrder, setLastOrder] = useState(null);
  const [useLastAddress, setUseLastAddress] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const router = useRouter();
  useEffect(() => {
    if (cart.paymentMethod) {
      setSelectedPaymentMethod(cart.paymentMethod);
    }
  }, [cart.paymentMethod]);

  const handleStateChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setInputValue(inputValue);
    let filteredOptions = [];
    if (inputValue.length >= 3) {
      filteredOptions = usStates.filter((state) =>
        state.toLowerCase().startsWith(inputValue)
      );
    }
    setFilteredStates(filteredOptions);
    setShowSuggestions(true);
    setSelectedSuggestion(-1); // Reset the selected suggestion when input value changes
  };

  const handleSelectState = (state) => {
    if (state === 'Bogotá D.C.') {
      setValue('city', 'Bogotá D.C.');
    }
    setValue('state', state);
    setShowSuggestions(false);
    setSelectedSuggestion(-1); // Reset the selected suggestion when an option is clicked
  };

  const handleKeyDown = (event) => {
    if (filteredStates.length > 0) {
      if (event.key === 'ArrowDown') {
        // Move selection down when ArrowDown key is pressed
        setSelectedSuggestion((prev) =>
          prev < filteredStates.length - 1 ? prev + 1 : prev
        );
      } else if (event.key === 'ArrowUp') {
        // Move selection up when ArrowUp key is pressed
        setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (event.key === 'Enter') {
        // Select the currently highlighted suggestion when Enter key is pressed
        if (selectedSuggestion !== -1) {
          handleSelectState(filteredStates[selectedSuggestion]);
        }
      }
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('phone', shippingAddress.phone);
    setValue('address', shippingAddress.address);
    setValue('state', shippingAddress.state);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('notes', shippingAddress.notes);
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, setValue, shippingAddress]);

  const submitHandler = ({
    fullName,
    phone,
    address,
    state,
    city,
    postalCode,
    notes,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, phone, address, state, city, postalCode, notes },
    });

    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,

        shippingAddress: {
          fullName,
          phone,
          address,
          state,
          city,
          postalCode,
          notes,
        },
      })
    );

    router.push('/placeorder');
  };

  const submitHandler2 = async ({
    fullName,
    phone,
    address,
    state,
    city,
    postalCode,
    notes,
    email,
    password,
  }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Login exitoso, puedes continuar con la compra');
        dispatch({
          type: 'SAVE_SHIPPING_ADDRESS',
          payload: { fullName, phone, address, state, city, postalCode, notes },
        });

        Cookies.set(
          'cart',
          JSON.stringify({
            ...cart,

            shippingAddress: {
              fullName,
              phone,
              address,
              state,
              city,
              postalCode,
              notes,
            },
          })
        );
        router.push('/placeorder');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const submitHandler3 = async ({
    fullName,
    phone,
    address,
    state,
    city,
    postalCode,
    notes,
    email,
    password,
  }) => {
    try {
      await axios.post('/api/auth/signup', {
        name: fullName,
        email: email,
        password: password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        // Display a success toast message
        toast.success('Registro exitoso puedes continuar con la compra');
        dispatch({
          type: 'SAVE_SHIPPING_ADDRESS',
          payload: { fullName, phone, address, state, city, postalCode, notes },
        });

        Cookies.set(
          'cart',

          JSON.stringify({
            ...cart,
            paymentMethod: selectedPaymentMethod,
            shippingAddress: {
              fullName,
              phone,
              address,
              state,
              city,
              postalCode,
              notes,
            },
          })
        );
        router.push('/placeorder');
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const { data } = await axios.get('/api/orders/lastOrder');
        setLastOrder(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (session) {
      fetchLastOrder();
    } else {
      setLastOrder(null);
    }
  }, [session]);

  useEffect(() => {
    setValue('fullName', session?.user?.name);
    if (useLastAddress && lastOrder) {
      const { shippingAddress } = lastOrder;
      setValue('fullName', shippingAddress.fullName);
      setValue('phone', shippingAddress.phone);
      setValue('address', shippingAddress.address);
      setValue('state', shippingAddress.state);
      setValue('city', shippingAddress.city);
      setValue('postalCode', shippingAddress.postalCode);
      setValue('notes', shippingAddress.notes);
      setSelectedPaymentMethod(paymentMethod || '');
    }
  }, [
    lastOrder,
    paymentMethod,
    session,
    session?.user?.name,
    setValue,
    useLastAddress,
  ]);

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
    reset({
      password: '',
      confirmPassword: '',
    });
  };

  const handleLoginSubmit = (
    fullName,
    phone,
    address,
    state,
    city,
    postalCode,
    notes,
    email,
    password
  ) => {
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    submitHandler2(
      fullName,
      phone,
      address,
      state,
      city,
      postalCode,
      notes,
      email,
      password
    );
  };

  const handleRegisterSubmit = (
    fullName,
    phone,
    address,
    state,
    city,
    postalCode,
    notes,
    email,
    password,
    selectedPaymentMethod
  ) => {
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    submitHandler3(
      fullName,
      phone,
      address,
      state,
      city,
      postalCode,
      notes,
      email,
      password,
      selectedPaymentMethod
    );
  };

  const handleContinueSubmit = (data) => {
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    submitHandler(data);
  };

  return (
    <Layout title="Dirección de envío">
      <CheckoutWizard activeStep={0}></CheckoutWizard>

      <div className="mb-3">
        <div className="text-center border border-b-gray-400 p-3 mb-4">
          <p>
            El envío tiene un valor de $12.000 en Bogotá D.C. y de $15.000 en el
            resto del país.
          </p>

          <p className="text-lg font-bold">
            ¡Si tu orden es mayor a $70.000 el envío es gratis!
          </p>
        </div>
      </div>
      <form
        className="mx-2"
        onSubmit={handleSubmit(
          !session && showLoginForm
            ? handleLoginSubmit
            : !session && !showLoginForm
            ? handleRegisterSubmit
            : handleContinueSubmit
        )}
      >
        {!session && (
          <div>
            {showLoginForm ? (
              <div>
                <div className="flex  gap-3  text-black">
                  <div className="text-2xl font-bold text-black">
                    Ingresa los datos de tu cuenta
                  </div>
                  <div className="">
                    <button
                      className="primary-button flex items-center gap-2"
                      onClick={toggleForm}
                    >
                      No tengo una cuenta
                      <FaArrowDown className="" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 text-black">
                  <div className="text-2xl font-bold text-black">
                    Crea una contraseña para tu cuenta
                  </div>
                  <div>
                    <button
                      className="primary-button flex items-center gap-2"
                      onClick={toggleForm}
                    >
                      Ya tengo una cuenta
                      <FaArrowDown className="" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {!session && (
          <div className="card p-2 mb-2">
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                required
              />
              {errors.email && (
                <div className="text-blue-950">{errors.email.message}</div>
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
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
                required
              />
              {showLoginForm && (
                <div className="mb-4">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}

              {errors.password && (
                <div className="text-blue-950">{errors.password.message}</div>
              )}
            </div>
            {!showLoginForm && (
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
                  placeholder="Confirma la contraseña"
                  required
                />
                {errors.confirmPassword && (
                  <div className="text-red-500 ">
                    {errors.confirmPassword.message}
                  </div>
                )}
                {errors.confirmPassword &&
                  errors.confirmPassword.type === 'validate' && (
                    <div className="text-red-500 ">
                      Las contraseñas no son iguales
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
        {lastOrder && (
          <div className="mb-2 mt-2">
            <label
              htmlFor="useLastAddress"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Deseas usar la dirección de su último pedido?
            </label>{' '}
            &nbsp;
            <input
              type="checkbox"
              id="useLastAddress"
              checked={useLastAddress}
              onChange={(e) => setUseLastAddress(e.target.checked)}
            />
            <div className="mb-2">
              <p className="text-sm">
                {lastOrder.shippingAddress.fullName}
                <br />{' '}
                {lastOrder.shippingAddress.phone && (
                  <>
                    {lastOrder.shippingAddress.phone} <br />{' '}
                  </>
                )}
                {lastOrder.shippingAddress.address}
                <br /> {lastOrder.shippingAddress.state}
                <br /> {lastOrder.shippingAddress.city}
                <br /> {lastOrder.shippingAddress.postalCode}
                <br />{' '}
              </p>
            </div>
          </div>
        )}
        <div className="mt-8 ">
          <div className="text-2xl font-bold text-black">
            Dirección de envío
          </div>
          <div className="mb-4 ">
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Nombre completo*
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              id="fullName"
              placeholder="Ingrese el nombre completo"
              {...register('fullName', { required: true, minLength: 3 })}
              autoCapitalize="true"
              required
            />
            {errors.fullName && (
              <p className="text-red-500">El nombre es requerido.</p>
            )}
          </div>
          <div className="mb-4 contact__form-div">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Teléfono*
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              id="phone"
              placeholder="Ingrese el teléfono"
              {...register('phone', { required: true, minLength: 3 })}
              autoCapitalize="true"
              required
            />
            {errors.phone && (
              <p className="text-red-500">El teléfono es requerido.</p>
            )}
          </div>

          <div className="mb-4 contact__form-div">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Dirección*
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              id="adress"
              placeholder="Ingrese la dirección"
              {...register('address', { required: true, minLength: 3 })}
              autoCapitalize="true"
              required
            />
            {errors.address && (
              <p className="text-red-500">La dirección es requerida.</p>
            )}
          </div>
          <div className="mb-4 contact__form-div">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Departamento o Bogotá D.C.*
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              id="state"
              placeholder="Ingrese el departamento"
              {...register('state', { required: true, minLength: 3 })}
              onChange={handleStateChange}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown} // Add the onKeyDown event handler
              autoCapitalize="true"
              required
            />
            {errors.state && (
              <p className="text-red-500">El departamento es requerido.</p>
            )}
            {filteredStates.length > 0 &&
              inputValue.length >= 3 &&
              showSuggestions && (
                <div className="mt-2 bg-white border border-gray-300 rounded-md absolute z-10 w-full">
                  {filteredStates.map((state, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer py-1 px-4 hover:bg-gray-200 ${
                        index === selectedSuggestion ? 'bg-gray-200' : ''
                      }`} // Highlight the selected suggestion
                      onClick={() => handleSelectState(state)}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
          </div>
          <div className="mb-4 contact__form-div">
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Ciudad*
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              id="city"
              placeholder="Ingrese la ciudad"
              {...register('city', { required: true, minLength: 3 })}
              autoCapitalize="true"
              required
            />
            {errors.city && (
              <p className="text-red-500">La ciudad es requerida.</p>
            )}
          </div>
          <div className="mb-4 contact__form-div">
            <label
              htmlFor="postalCode"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Código Postal*
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              id="postalCode"
              placeholder="Ingrese el código postal"
              {...register('postalCode', { required: true, minLength: 3 })}
              autoCapitalize="true"
              required
            />
            {errors.postalCode && (
              <p className="text-red-500">El código postal es requerido.</p>
            )}
          </div>
          <div className="mb-4 contact__form-div">
            <label
              htmlFor="notes"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Instrucciones especiales para el envío
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              type="text"
              id="notes"
              placeholder="Instrucciones de envío"
              {...register('notes', { required: false, minLength: 3 })}
              autoCapitalize="true"
            />
            {errors.notes && (
              <p className="text-red-500">Las notas son requeridas.</p>
            )}
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <div className="text-2xl font-bold text-black">Método de pago</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-items-center items-center">
              <div className="flex gap-2">
                <input
                  name="paymentMethod"
                  className="p-2 outline-none focus:ring-0"
                  id="Mercadopago"
                  type="radio"
                  checked={selectedPaymentMethod === 'Mercadopago'}
                  onChange={() => setSelectedPaymentMethod('Mercadopago')}
                />
                <label className="p-2" htmlFor="Mercadopago">
                  <Image src={Mercadopago} alt="Mercadopago" width={250} />
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  name="paymentMethod"
                  className="p-2 outline-none focus:ring-0"
                  id="Contraentrega"
                  type="radio"
                  checked={selectedPaymentMethod === 'Contraentrega'}
                  onChange={() => setSelectedPaymentMethod('Contraentrega')}
                />
                <label className="p-2" htmlFor="Contraentrega">
                  <Image src={Contraentrega} alt="Contraentrega" width={250} />
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4 flex gap-2 items center">
            <input
              type="checkbox"
              className="border-gray-300 rounded-sm"
              id="terms"
              required
            />
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="terms"
            >
              Acepto los términos, condiciones y política de tratamiento de
              datos.
            </label>
          </div>

          <div className="mb-4 contact__form-div">
            {session ? (
              <button
                className="primary-button w-full"
                type="submit"
                onClick={() => handleSubmit(handleContinueSubmit)()}
              >
                Continuar
              </button>
            ) : (
              <>
                {showLoginForm ? (
                  <button className="primary-button w-full" type="submit ">
                    Ingresar y Continuar
                  </button>
                ) : (
                  <button className="primary-button w-full" type="submit">
                    Registrarse y Continuar
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
}
