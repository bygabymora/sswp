import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import emailjs from '@emailjs/browser';

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const calculateShippingCost = (brutPrice, taxPrice, city) => {
    if (brutPrice + taxPrice > 90000) {
      return 0;
    } else if (city === 'Bogotá D.C.') {
      return 8000;
    } else {
      return 12500;
    }
  };

  const brutPrice = round2(itemsPrice * 0.81);
  const taxPrice = round2(itemsPrice * 0.19);

  const shippingCost = calculateShippingCost(
    brutPrice,
    taxPrice,
    shippingAddress.city
  );
  const totalPrice = round2(brutPrice + taxPrice + shippingCost);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const formatNumberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const placeOrderHandler = async () => {
    sendEmail();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
    console.log({
      cartItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
    });
  };

  //----EmailJS----//

  const form = useRef();

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/orders/placeOrder');
      const userData = response.data;

      setEmail(userData.email);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const [email, setEmail] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailPhone, setEmailPhone] = useState('');
  const [emailPaymentMethod, setEmailPaymentMethod] = useState('');
  const [emailTotalOrder, setEmailTotalOrder] = useState('');
  const [emailShippingPreference, setEmailShippingPreference] = useState('');

  useEffect(() => {
    fetchUserData();
    setEmailName(shippingAddress.fullName);
    setEmailPhone(shippingAddress.phone);
    setEmailPaymentMethod(paymentMethod);
    setEmailTotalOrder(totalPrice);
    setEmailShippingPreference(shippingAddress.notes);
  }, [
    paymentMethod,
    shippingAddress.fullName,
    shippingAddress.phone,
    totalPrice,
    shippingAddress.notes,
  ]);

  function sendEmail() {
    const formData = new FormData();

    formData.append('user_name', emailName);
    formData.append('user_phone', emailPhone);
    formData.append('user_email', email);
    formData.append('total_order', emailTotalOrder);
    formData.append('payment_method', emailPaymentMethod);
    formData.append('shipping_preference', emailShippingPreference);

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_w13byb7',
        form.current,
        'VGgpXukeMgVAWbiOf'
      )
      .then(
        (result) => {
          console.log('Email sent', result.text);
        },
        (error) => {
          console.log('Error sendingemail', error.text);
        }
      );
  }

  //-----------//

  return (
    <Layout title="Ordenar">
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Ordenar</h1>
      {cartItems.length === 0 ? (
        <div>
          Tu carrito está vacío{' '}
          <Link href="/products" className="font-bold underline">
            ¡Ve de compras!
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Dirección de envío</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.phone}{' '}
                {shippingAddress.address}, {shippingAddress.state},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode}, ,
                {shippingAddress.notes}
              </div>
              <div>
                <Link className="underline font-bold" href="/shipping">
                  Editar
                </Link>
              </div>
            </div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Método de pago</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link className="underline font-bold" href="/payment">
                  Editar
                </Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Productos</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Producto</th>
                    <th className="    p-5 text-right">Cantidad</th>
                    <th className="  p-5 text-right">Precio</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.slug}
                            width={50}
                            height={50}
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                            }}
                          ></Image>
                          {item.slug}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">
                        ${formatNumberWithDots(item.price)}
                      </td>
                      <td className="p-5 text-right">
                        ${formatNumberWithDots(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link className="underline font-bold" href="/cart">
                  Editar
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Resumen</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Productos</div>
                    <div>${formatNumberWithDots(brutPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>I.V.A.</div>
                    <div>${formatNumberWithDots(taxPrice)}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Costo de Envío</div>
                    <div>${formatNumberWithDots(shippingCost)}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${formatNumberWithDots(totalPrice)}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="primary-button w-full"
                  >
                    {loading ? 'Cargando...' : 'Confirmar Compra'}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <form ref={form} hidden>
            <input type="text" name="user_name" value={emailName} />
            <input type="text" name="user_phone" value={emailPhone} />
            <input type="text" name="total_order" value={emailTotalOrder} />
            <input
              type="text"
              name="payment_method"
              value={emailPaymentMethod}
            />

            <input
              type="text"
              name="shipping_preference"
              value={emailShippingPreference}
            />
            <input type="text" name="user_email" value={email} />
          </form>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
