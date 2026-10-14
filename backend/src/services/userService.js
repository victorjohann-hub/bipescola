import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import * as userModel from "../models/userModel.js";

function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

export async function createUser({ nome, email }) {
  const tempPassword = generatePassword();

  const hash = await bcrypt.hash(tempPassword, 10);

  const user = await userModel.create({
    nome,
    email,
    senha: hash,
    firstLogin: true
  });

  return {
    user,
    tempPassword
  };
}

export async function loginUser({ email, senha }) {
  const user = await userModel.findByEmail(email);

  if (!user) {
    throw new Error("Email ou senha inválidos");
  }

  const passwordMatch = await bcrypt.compare(senha, user.senha);

  if (!passwordMatch) {
    throw new Error("Email ou senha inválidos");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      foto: user.foto || null
    }
  };
}

export async function getUsers() {
  return await userModel.findAll();
}

export async function getUserById(id) {
  return await userModel.findById(id);
}

export async function updateUser(id, data) {
  return await userModel.updateById(id, data);
}

export async function deleteUser(id) {
  return await userModel.deleteById(id);
}


export async function changePassword(id, senhaAtual, novaSenha) {
  const user = await userModel.findByEmail(
    (await userModel.findById(id))?.email
  );

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const passwordMatch = await bcrypt.compare(senhaAtual, user.senha);

  if (!passwordMatch) {
    throw new Error("Senha atual incorreta");
  }

  const senhaHash = await bcrypt.hash(novaSenha, 10);
  const updated = await userModel.updatePassword(id, senhaHash);

  if (!updated) {
    throw new Error("Não foi possível atualizar a senha");
  }

  return true;
}

export async function forgotPassword(email) {
  const user = await userModel.findByEmail(email);
  if (!user) return true;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await userModel.saveResetToken(user.id, token, expiresAt);

  if (
    process.env.RESET_TOKEN_LOG === "true" &&
    process.env.NODE_ENV !== "production"
  ) {
    console.log("[RECUPERACAO - DESENVOLVIMENTO]");
    console.log("Conta:", user.email);
    console.log("Token:", token);
    console.log("Expira em:", expiresAt.toISOString());
    return true;
  }

  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("Configuração SMTP incompleta");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: smtpUser, pass: smtpPass }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || smtpUser,
    to: user.email,
    subject: "Redefinição de senha - BipEscola",
    text: "Seu token de recuperação é: " + token +
      "\nEle expira em 1 hora."
  });

  return true;
}
export async function resetPassword(email, token, novaSenha) {
  const user = await userModel.findByResetToken(email, token);

  if (!user) {
    throw new Error("Token inválido ou expirado");
  }

  const senhaHash = await bcrypt.hash(novaSenha, 10);
  const updated = await userModel.updatePassword(user.id, senhaHash);

  if (!updated) {
    throw new Error("Não foi possível redefinir a senha");
  }

  return true;
}

export async function updateUserPhoto(id, foto) {
  const updated = await userModel.updatePhoto(id, foto);

  if (!updated) {
    throw new Error("Usuário não encontrado ou foto não atualizada");
  }

  return await userModel.findById(id);
}



