import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ProductItem = ({ product }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [qty, setQty] = useState(1);

  const addToCartHandler = async () => {
    const exisItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = exisItem ? exisItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      setIsOutOfStock(true);
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('item añadido al carrito');

    if (product.countInStock < quantity) {
      alert('No tenemos suficiente inventario para esta compra');

      return quantity;
    }
  };

  return (
    <div className="card">
      <Link href={{ pathname: `products/${product.slug}` }}>
        <Image
          src={`${product.image}`}
          alt={product.description}
          className="product-image"
          width={300}
          height={300}
        />
      </Link>
      <div className="flex flex-col justify-center items-center p-5">
        <Link href={{ pathname: `products/${product.slug}` }}>
          <h2 className="font-bold text-lg">{product.name}</h2>
          <h2 className="font-bold text-xs">
            <br />
            {product.includes}
          </h2>
        </Link>
        <div className="mb-2 flex items-center justify-center lg:block">
          <div className="font-bold mt-4">Quantity &nbsp;</div>
          <div className="flex items-center flex-row">
            <button
              className="border px-2 py-1 card"
              onClick={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
            >
              -
            </button>
            <span className="px-1 mt-4">{isOutOfStock ? 0 : qty}</span>
            <button
              className="border px-2 py-1 card"
              onClick={() => {
                if (qty < product.countInStock) {
                  setQty(qty + 1);
                } else {
                  alert(
                    `Sorry,  we do not have any additional units of ${product.manufacturer} ${product.slug} at this moment`
                  );
                }
              }}
              disabled={isOutOfStock}
            >
              +
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">${product.price}</p>
        <button
          className="primary-button align-middle mt-2"
          type="button"
          onClick={addToCartHandler}
          disabled={product.countInStock === 0 || isOutOfStock}
        >
          {isOutOfStock ? 'Fuera de inventario' : 'Añadir al carrito'}
        </button>
        {isOutOfStock && (
          <form className="text-center ">
            <label className="mt-3 font-bold ">
              Únete a nuestra lista de espera
            </label>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <button className="primary-button mt-3" type="submit">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
