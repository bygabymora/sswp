import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import Image from 'next/image';
import Mercadopago from '../public/images/mercadopago2.svg';
import Contraentrega from '../public/images/contraentrega.svg';

export default function PaymentScreen() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Método de pago es requerido');
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );

    router.push('/placeorder');
  };
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push('/shipping');
    }
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title="Dirección de envío">
      <CheckoutWizard activeStep={0} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Método de pago</h1>
        <p>
          Puedes realizar tu pago por medio de MercadoPago o Contraentrega en
          efectivo.
        </p>
        <br />
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

        <div className="mb-4 flex justify-between">
          <button
            onClick={() => router.push('/shipping')}
            type="button"
            className="primary-button"
          >
            Atrás
          </button>
          <button className="primary-button">Siguiente</button>
        </div>
      </form>
    </Layout>
  );
}

PaymentScreen.auth = true;
