import { getToken } from 'next-auth/jwt';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user) {
    return;
  }
  await db.connect();
  const lastOrder = await Order.findOne({ user: user._id }).sort({
    createdAt: -1,
  });
  await db.disconnect();
  if (lastOrder) {
    res.send(lastOrder);
  } else {
    return;
  }
};

export default handler;
