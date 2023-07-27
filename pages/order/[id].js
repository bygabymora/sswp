import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Router, useRouter } from 'next/router'; // Removed unnecessary import for Router
import { useEffect, useReducer, useState } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    default:
      return state; // Fixed the missing return statement here
  }
}

function OrderScreen() {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: '',
    });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;
  const discountAmount = itemsPrice * 0.03;

  const handleCheckout = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.post('/api/checkout', {
        paymentMethod: paymentMethod,
      });

      if (data.sessionId) {
        window.location = `https://checkout.stripe.com/pay/${data.sessionId}`;
      } else if (data.redirectTo) {
        Router.push(data.redirectTo); // Corrected Router to useRouter
      }
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: totalPrice,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('La orden ha sido pagada exitosamente');

        // Mark payment as complete and show success message
        setPaymentComplete(true);

        // Reload the page after a short delay (e.g., 2 seconds)
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        dispatch({ type: 'PAY_FAIL', payload: getError(error) });
        toast.error(getError(error));
      }
    });
  };

  const onError = (err) => {
    dispatch({ type: 'PAY_FAIL', payload: getError(err) });
    toast.error(getError(err));
  };

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : paymentComplete ? (
        <div className="alert-success">
          Payment completed successfully. Reloading...
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-2">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-3">
              <h2 className="mb-2 text-lg">Dirección de envío</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.state}
              </div>
              {isDelivered ? (
                <div className="alert-success">Enviado el {deliveredAt}</div>
              ) : (
                <div className="alert-error">No enviado</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Método de pago</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Pagado el {paidAt}</div>
              ) : (
                <div className="alert-error">No pagado</div>
              )}
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
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card p-2">
              <h2 className="mb-2 text-lg">Resumen</h2>
              <ul>
                <li>
                  <div className="mb-2 px-3 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 px-3 flex justify-between">
                    <div>Impuestos</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                {paymentMethod === 'Nequi-Daviplata' ? (
                  <li>
                    <div className="mb-2 px-3 flex justify-between">
                      <div>Descuento</div>
                      <div>- ${discountAmount}</div>
                    </div>
                  </li>
                ) : null}
                <li>
                  <div className="mb-2  px-3 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                  <br />
                </li>
                {!isPaid && (
                  <li className="buttons-container text-center mx-auto">
                    {paymentMethod === 'Stripe' ? (
                      <button
                        className="primary-button w-full mt-2"
                        onClick={handleCheckout}
                      >
                        Pago con Mercadopago
                      </button>
                    ) : paymentMethod === 'Nequi-Daviplata' ? (
                      <Link
                        className="primary-button w-full mt-2"
                        href="/ManufacturerForm"
                      >
                        Nequi-Daviplata
                      </Link>
                    ) : paymentMethod === 'Paypal' ? (
                      isPending ? (
                        <div>Cargando...</div>
                      ) : (
                        <PayPalButtons
                          className="fit-content  mt-3"
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      )
                    ) : null}
                    {loadingPay && <div>Cargando...</div>}
                  </li>
                )}

                <br />
                <li>
                  <div className="mb-2 px-3 flex justify-between">
                    <div>
                      El envío no está determinado, se te notificará cuando se
                      te envíe el producto y su valor.
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
