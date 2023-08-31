import mercadopago from 'mercadopago';

// Configura tus credenciales de acceso
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const mercadopagoHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { totalPrice, orderId } = req.body;

    const preference = {
      items: [
        {
          title: `Orden #${orderId}`,
          unit_price: parseFloat(totalPrice),
          quantity: 1,
          currency_id: 'COP', // Moneda colombiana
        },
      ],
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      res.status(200).json({ init_point: response.body.init_point });
    } catch (error) {
      res
        .status(400)
        .json({ error: 'Error al crear la preferencia de MercadoPago' });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
};

export default mercadopagoHandler;
