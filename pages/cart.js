import React from 'react';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { BsTrash3 } from 'react-icons/bs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const updateCartHandler = async (item, qty) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      alert("Sorry, we don't have enough of that item in stock.");
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };
  return (
    <Layout title="Cart">
      <h1 className="mb-4 text-xl">Tu Carrito</h1>
      {cartItems.length === 0 ? (
        <div className="mb-11 ">
          Tu carrito está vacío,{' '}
          <Link className="font-bold underline" href="/products">
            ¡Ve a comprar!
          </Link>
          <br />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 md:gap-5 md:m-4">
          <div className=" md:col-span-3">
            <table className="table-auto min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Producto</th>
                  <th className="p-5 py-2 text-right">Cantidad</th>
                  <th className="p-5 py-2 text-right">Precio</th>
                  <th className="p-5"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td className="p-5">
                      <Link
                        href={`/products/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.reference}
                          width={50}
                          height={50}
                        />
                        <br />
                        <div className="items-center self-center">
                          &nbsp;{item.name}
                        </div>
                        <br />
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeItemHandler(item)}>
                        <BsTrash3 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 font-xl">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}){' '}
                  {''}: $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push('/shipping')}
                  className="primary-button w-full"
                >
                  Comprar
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(CartScreen), {
  ssr: false,
});
