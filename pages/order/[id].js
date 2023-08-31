import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Removed unnecessary import for Router
import { useEffect, useReducer, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

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
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    case 'AT_COSTUMERS_REQUEST':
      return { ...state, loadingAtCostumers: true };
    case 'AT_COSTUMERS_SUCCESS':
      return { ...state, loadingAtCostumers: false, successAtCostumers: true };
    case 'AT_COSTUMERS_FAIL':
      return { ...state, loadingAtCostumers: false, successAtCostumers: false };
    default:
      return state; // Fixed the missing return statement here
  }
}

function OrderScreen() {
  const { data: session } = useSession();
  const [paymentComplete, setPaymentComplete] = useState(false);

  const { query } = useRouter();
  const orderId = query.id;
  const trackUrlRef = useRef(null);
  const trackNumberRef = useRef(null);

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
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

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [order, orderId, successPay, successDeliver]);

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

  const handlePayment = async () => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/pay`
        // Include any necessary payload here
      );
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Order is paid successfully');

      // Mark payment as complete and show success message
      setPaymentComplete(true);

      // Reload the page after payment success
      window.location.reload();
    } catch (error) {
      dispatch({ type: 'PAY_FAIL', payload: getError(error) });
      toast.error(getError(error));
    }
  };

  const handleButtonClick = () => {
    handlePayment();
  };

  const handleMercadoPagoClick = async () => {
    try {
      const response = await axios.post('/api/mercadopago', {
        totalPrice,
        orderId,
      });
      const { init_point } = response.data;
      window.location.href = init_point; // Redirige al usuario a MercadoPago
    } catch (error) {
      console.error('Error al obtener la URL de MercadoPago', error);
    }
  };
  async function deliverOrderHandler(e) {
    e.preventDefault(); // prevent default form submission

    const trackUrl = trackUrlRef.current.value;
    const trackNumber = trackNumberRef.current.value;

    // Validation: Check for whitespace-only strings
    if (!trackUrl.trim() || !trackNumber.trim()) {
      toast.error('Please provide valid inputs.');
      return; // exit function
    }

    try {
      dispatch({ type: 'DELIVER_REQUEST' });

      // Send tracking URL and number with the axios request
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {
          trackUrl: trackUrl,
          trackNumber: trackNumber,
        }
      );

      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is processed');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return (
    <Layout
      title={`Orden ${orderId.substring(orderId.length - 8).toUpperCase()}`}
    >
      <h1 className="mb-4 text-xl">{`Order ${orderId
        .substring(orderId.length - 8)
        .toUpperCase()}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : paymentComplete ? (
        <div className="alert-success">
          Pago redireccionado exitosamente. Redirecionando...
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
                <div className="alert-success">
                  Enviado el {deliveredAt.substring(0, 10)}
                </div>
              ) : (
                <div className="alert-error">En preparación</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Método de pago</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">
                  Pagado el {paidAt.substring(0, 10)}
                </div>
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
                    {paymentMethod === 'Mercadopago' ? (
                      <button
                        className="primary-button w-full mt-2"
                        onClick={handleMercadoPagoClick}
                      >
                        Mercadopago
                      </button>
                    ) : paymentMethod === 'Nequi-Daviplata' ? (
                      <div>
                        {session.user.isAdmin && (
                          <button
                            className="primary-button w-full"
                            onClick={handleButtonClick}
                          >
                            Marcar como pagado
                          </button>
                        )}
                        {!session.user.isAdmin && (
                          <Link
                            className="primary-button w-full mt-2"
                            href="/ManufacturerForm"
                          >
                            Nequi-Daviplata
                          </Link>
                        )}
                      </div>
                    ) : null}
                    {loadingPay && <div>Cargando...</div>}
                  </li>
                )}
                {session.user.isAdmin && order.isPaid && !order.isDelivered && (
                  <li>
                    {loadingDeliver && <div>Loading...</div>}
                    <form
                      action={`/api/admin/orders/${order._id}/deliver`}
                      method="POST"
                    >
                      <section>
                        <input
                          ref={trackUrlRef}
                          name="trackUrl"
                          placeholder="URL de seguimiento"
                          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline m-1"
                          required
                        />
                        <input
                          ref={trackNumberRef}
                          name="trackNumber"
                          placeholder="Número y empresa de envío"
                          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline m-1"
                          required
                        />
                        <button
                          type="submit"
                          role="link"
                          className="primary-button w-full"
                          onClick={deliverOrderHandler}
                        >
                          Enviar Orden
                        </button>
                      </section>
                    </form>
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
