import bcryptjs from 'bcryptjs';
import User from '../../../models/user';
import db from '../../../utils/db';
import { getToken } from 'next-auth/jwt';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send({ message: 'Registro Requerido' });
  }

  const { email, password } = req.body;

  if (
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({ message: 'Validation error' });
    return;
  }

  await db.connect();
  const toUpdateUser = await User.findOne({ email: email });

  if (toUpdateUser) {
    toUpdateUser.password = bcryptjs.hashSync(password);
    await toUpdateUser.save();
    await db.disconnect();
    res.send({ message: 'User updated' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not found' });
  }
}

export default handler;
