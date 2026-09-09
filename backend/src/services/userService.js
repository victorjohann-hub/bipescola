

import * as UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

export async function createParent({ name, email }) {
  const tempPassword = generatePassword();
  const hash = await bcrypt.hash(tempPassword, 10);

  const user = await UserModel.create({
    name,
    email,
    password: hash,
    role: 'PARENT',
    firstLogin: true
  });

  return { user, tempPassword };
}