import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsBackspace, BsCart2 } from 'react-icons/bs';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { Store } from '../../utils/Store';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { TbTruckDelivery } from 'react-icons/tb';
import Mercadopago from '../../public/images/mercadopago.svg';

export default function ProductScreen(props) {
  const formatNumberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const { product } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [showPopup, setShowPopup] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [qty, setQty] = useState(1);
  const [currentImage, setCurrentImage] = useState(product.image);
  const changeImage = (image) => {
    setCurrentImage(image);
  };

  if (!product) {
    return (
      <Layout title="Product Not found">
        <div>Product Not Found</div>
      </Layout>
    );
  }

  const addToCartHandler = async () => {
    const exisItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = exisItem ? exisItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      setIsOutOfStock(true);
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    if (product.countInStock < quantity) {
      toast.error('Disculpa, no tenemos suficiente de ese item en inventario.');

      return quantity;
    }
    setShowPopup(true);
  };

  const continueShoppingHandler = () => {
    setShowPopup(false);
    router.push('/products');
  };

  const goToCartHandler = () => {
    setShowPopup(false);
    router.push('/cart');
  };
  console.log(product.image);
  console.log(product.image2);
  console.log(product.image3);
  console.log(product.image4);
  return (
    <Layout title={product.manufacturer}>
      <div className="py-2">
        <Link href={'/products'} className="flex gap-4 items-center">
          <BsBackspace />
          Regresar a productos.
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="block md:hidden">
          <div className="card 2 p-5 static-banner-container3 ">
            <div className="font-bold text-center text-red-500">
              ¡Envío GRATIS por compras superiores a $80.000!
            </div>

            <div className=" mt-3 text-center text-xs flex flex-row text-green-500 justify-center  items-center">
              <RiSecurePaymentLine className="text-2xl " />
              &nbsp; Tu compra siempre protegida por &nbsp;
              <Image
                src={Mercadopago}
                alt="Mercadopago"
                width={75}
                height={30}
              />
              .
            </div>
            <div className=" mt-3 text-center flex flex-row text-green-500 justify-center text-xs items-center">
              <TbTruckDelivery className="text-2xl" /> &nbsp; También puedes
              pagar contraentregra.
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="product-image col-span-1 md:mb-5">
            <Image
              src={currentImage}
              alt={product.reference}
              width={500}
              height={800}
            />
          </div>
          <div className="flex flex-row md:flex-col justify-center md:justify-start col-span-1">
            {[product.image, product.image2, product.image3].map(
              (img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => changeImage(img)}
                  style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                  width={100}
                  height={100}
                />
              )
            )}
          </div>
        </div>
        <div className="product-info">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold">{product.name}</h1>
          </div>
          <div className="mb-4">
            <div className="card  p-5">
              <div className="mb-2 flex items-center justify-center ">
                <div className="font-bold mt-4">Cantidad &nbsp;</div>
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
              <div className="mb-2 flex justify-between">
                <div className="font-bold">Precio</div>
                <div className="text-2xl">
                  ${formatNumberWithDots(product.price)}
                </div>
              </div>
              <div className="mb-2 flex justify-between">
                <div className="font-bold">Inventario</div>
                &nbsp;
                <div className="text-lg ">
                  {isOutOfStock || product.countInStock === 0
                    ? 'Sin inventario'
                    : 'En inventario'}
                </div>
              </div>
              <button
                className="primary-button cart-button"
                type="button"
                onClick={addToCartHandler}
                disabled={product.countInStock === 0 || isOutOfStock}
              >
                {isOutOfStock ? 'Fuera de inventario' : 'Añadir al carrito'}
              </button>
              {showPopup && (
                <div className="popup">
                  <div className="popup-content">
                    <p>item añadido al carrito.</p>
                    <br />
                    <div className="flex gap-1 justify-evenly">
                      <button
                        className="primary-button w-1/2 text-xs text-left"
                        onClick={continueShoppingHandler}
                      >
                        Continuar comprando
                      </button>
                      <button
                        className=" flex primary-button w-1/2 text-xs text-left items-center"
                        onClick={goToCartHandler}
                      >
                        <p>Ir al carrito</p> &nbsp;
                        <BsCart2 className="text-2xl" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isOutOfStock && (
                <form className="text-center mt-3 ">
                  <label className="mt-3 font-bold ">
                    Únete a nuestra lista de espera
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  />
                  <button className="primary-button mt-3" type="submit">
                    Enviar
                  </button>
                </form>
              )}
            </div>
            <div className="hidden md:block">
              <div className="card 2 p-5 static-banner-container2 flex flex-col ">
                <div className="font-bold text-center text-red-500">
                  ¡Envío GRATIS por compras superiores a $80.000!
                </div>

                <div className=" mt-3 text-center flex flex-row text-green-500 justify-center">
                  <RiSecurePaymentLine className="text-2xl " />
                  &nbsp; Tu compra siempre protegida por &nbsp;
                  <Image
                    src={Mercadopago}
                    alt="Mercadopago"
                    width={75}
                    height={30}
                  />
                  .
                </div>
                <div className=" mt-3 text-center flex flex-row text-green-500 justify-center">
                  <TbTruckDelivery className="text-2xl" /> &nbsp; También puedes
                  pagar contraentregra.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();

  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
