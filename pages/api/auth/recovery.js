import bcryptjs from 'bcryptjs';
import User from '../../../models/user';
import db from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const { email, password } = req.body;

  // Validation for password reset
  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({ message: 'Validation error' });
    return;
  }

  await db.connect();
  const toUpdateUser = await User.findOne({ email });

  if (!toUpdateUser) {
    await db.disconnect();
    return res.status(404).send({ message: 'User not found' });
  }

  // Update the user's password
  toUpdateUser.password = bcryptjs.hashSync(password);
  await toUpdateUser.save();

  await db.disconnect();
  res.send({ message: 'Password reset successful' });
}

export default handler;
