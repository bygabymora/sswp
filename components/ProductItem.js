import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export const ProductItem = ({ product }) => {
  const formatNumberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const addToCartHandler = async () => {
    const exisItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = exisItem ? exisItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/${product._id}`);
    const { trackAddToCart } = require('../utils/facebookPixel');
    trackAddToCart({
      content_ids: [product._id],
      content_name: product.name,
      value: product.price,
      currency: 'COP',
    });

    if (data.countInStock < quantity) {
      setIsOutOfStock(true);
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('Item añadido al carrito');

    if (product.countInStock < quantity) {
      alert('No tenemos suficiente inventario para esta compra');

      return quantity;
    }
  };

  const buyNowHandler = async () => {
    addToCartHandler();
    router.push('/shipping');
  };

  return (
    <div className=" justify-center card   items-center text-center my-3 text-xs surface2 lg:text-[1rem] md:h-[24rem] lg:h-[26rem] xl:h-[26rem] 2xl:h-[25rem] flex flex-col">
      <h2 className="font-bold my-2 h-[3.5rem] flex justify-center items-center">
        {product.name}
      </h2>
      <div className="grid grid-cols-2 justify-between surface3 md:h-[14rem] lg:h-[16rem] xl:h-[16rem] 2xl:h-[15rem]">
        <Link
          href={{ pathname: `products/${product.slug}` }}
          className="justify-center items-center text-center flex-1"
        >
          <div className="flex justify-center items-center ">
            <Image
              src={`${product.image}`}
              alt={product.description}
              className="max-w-full h-auto md:w-auto md:h-[14rem] surface3"
              width={800}
              height={1000}
            />
          </div>
        </Link>
        <div className="flex flex-col  items-center p-3">
          <Link href={{ pathname: `products/${product.slug}` }}>
            <div className="h-[7rem] md:m-2">
              <h2 className="font-bold text-sm md:text-[0.8rem] ">
                {product.includes}
              </h2>
            </div>
            <div className="mb-2 flex items-center flex-col text-center justify-center lg:block ">
              <div className="font-bold mt-4">Cantidad</div>
              <div className="flex items-center justify-center flex-row">
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
                        `Lo siento, no tenemos suficientes unidades de ${product.name} en este momento`
                      );
                    }
                  }}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center text-xl font-bold text-gray-500">
              ${formatNumberWithDots(product.price)}
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center p-5 gap-2">
        <button
          className="primary-button align-middle sm:mt-2 mt-1 h-[4rem] sm:h-[3rem] w-full"
          type="button"
          onClick={addToCartHandler}
          disabled={product.countInStock === 0 || isOutOfStock}
        >
          {isOutOfStock ? 'Fuera de inventario' : 'Añadir al carrito'}
        </button>
        <button
          className="primary-button align-middle sm:mt-2 mt-1 h-[4rem] sm:h-[3rem] w-full"
          type="button"
          onClick={buyNowHandler}
          disabled={product.countInStock === 0 || isOutOfStock}
        >
          {isOutOfStock ? 'Fuera de inventario' : 'Comprar ahora'}
        </button>
      </div>
    </div>
  );
};
