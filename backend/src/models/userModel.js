
import { users } from '../database/fakedb.js';

export async function create({ name, email, password, role, firstLogin }) {
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role,
    firstLogin
  };

  users.push(newUser);

  return newUser;
}

export async function findByEmail(email) {
  return users.find(user => user.email === email);
}

export async function findById(id) {
  return users.find(user => user.id === id);
}