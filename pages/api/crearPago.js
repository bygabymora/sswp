// pages/api/createPreference.js
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

export default async createPreference (req, res) => {
  if (req.method === 'POST') {
    const { title, quantity, unit_price } = req.body;

    let preference = {
      items: [{
        title: title,
        quantity: quantity,
        currency_id: 'MXN', // Asume que es México, cambia según tu país.
        unit_price: unit_price
      }]
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      res.status(200).json(response.body);
    } catch (error) {
      console.error("Error al crear preferencia: ", error);
      res.status(500).json({ error: 'Error al crear la preferencia' });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
};
