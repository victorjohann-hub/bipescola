import * as userService from '../services/userService.js';

export async function createUser(req, res) {
  try {
    const { nome, email, role } = req.body ?? {};

    if (!nome || !email) {
      return res.status(400).json({
        error: 'nome e email são obrigatórios'
      });
    }

    if (role && !['ADM', 'PROF', 'PARENT', 'PORTEIRO'].includes(role)) {
      return res.status(400).json({
        error: 'Cargo (role) inválido'
      });
    }

    const result = await userService.createUser({
      nome,
      email,
      role: role || 'PARENT'
    });

    return res.status(201).json({
      message: 'Conta criada',
      data: {
        id: result.user.id,
        nome: result.user.nome,
        email: result.user.email,
        role: result.user.role
      },
      tempPassword: result.tempPassword
    });

  } catch (error) {
    return res.status(400).json({
      error: error.message
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, senha } = req.body ?? {};

    if (!email || !senha) {
      return res.status(400).json({
        error: 'email e senha são obrigatórios'
      });
    }

    const result = await userService.loginUser({
      email,
      senha
    });

    return res.status(200).json({
      message: 'Login realizado com sucesso',
      token: result.token,
      user: result.user
    });

  } catch (error) {
    return res.status(401).json({
      error: error.message
    });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await userService.getUsers();

    return res.status(200).json({
      message: 'Lista de usuários retornada com sucesso',
      data: users
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Não foi possível listar os usuários',
      details: error.message
    });
  }
}

export async function getUser(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        error: 'ID do usuário inválido'
      });
    }

    if (req.user && req.user.role !== 'ADM' && Number(req.user.id) !== userId) {
      return res.status(403).json({
        error: 'Acesso negado'
      });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    return res.status(200).json({
      message: 'Usuário encontrado com sucesso',
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Não foi possível buscar o usuário',
      details: error.message
    });
  }
}

export async function updateUser(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        error: 'ID do usuário inválido'
      });
    }

    const { nome, email, role } = req.body ?? {};

    if (!nome || !email) {
      return res.status(400).json({
        error: 'nome e email são obrigatórios'
      });
    }

    if (role !== undefined && !['ADM', 'PROF', 'PARENT', 'PORTEIRO'].includes(role)) {
      return res.status(400).json({
        error: 'Cargo (role) inválido'
      });
    }

    if (req.user && req.user.role !== 'ADM' && Number(req.user.id) !== userId) {
      return res.status(403).json({
        error: 'Acesso negado'
      });
    }

    let roleToUpdate = undefined;
    if (role !== undefined && (!req.user || req.user.role === 'ADM')) {
      roleToUpdate = role;
    }

    const existingUser = await userService.getUserById(userId);

    if (!existingUser) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const updatePayload = { nome, email };
    if (roleToUpdate !== undefined) {
      updatePayload.role = roleToUpdate;
    }

    const user = await userService.updateUser(userId, updatePayload);

    return res.status(200).json({ 
      message: 'Usuário atualizado com sucesso',
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Não foi possível atualizar o usuário',
      details: error.message
    });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = Number(req.params.id);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        error: 'ID do usuário inválido'
      });
    }

    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }

    if (req.user.role !== 'ADM') {
      return res.status(403).json({
        error: 'Somente ADM pode excluir usuários'
      });
    }

    if (Number(req.user.id) === userId) {
      return res.status(403).json({
        error: 'ADM não pode excluir a própria conta'
      });
    }

    const existingUser = await userService.getUserById(userId);

    if (!existingUser) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    const deleted = await userService.deleteUser(userId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    return res.status(200).json({
      message: 'Usuário excluído com sucesso'
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Não foi possível excluir o usuário',
      details: error.message
    });
  }
}


export async function changePassword(req, res) {
  try {
    const { senhaAtual, novaSenha } = req.body ?? {};

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        error: 'senhaAtual e novaSenha são obrigatórias'
      });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({
        error: 'A nova senha deve ter pelo menos 8 caracteres'
      });
    }

    await userService.changePassword(
      req.user.id,
      senhaAtual,
      novaSenha
    );

    return res.status(200).json({
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    const status = error.message === 'Senha atual incorreta' ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body ?? {};

    if (!email) {
      return res.status(400).json({ error: 'email é obrigatório' });
    }

    await userService.forgotPassword(email);

    return res.status(200).json({
      message: 'Se o email estiver cadastrado, você receberá instruções para redefinir a senha'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Não foi possível iniciar a recuperação de senha'
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, token, novaSenha } = req.body ?? {};

    if (!email || !token || !novaSenha) {
      return res.status(400).json({
        error: 'email, token e novaSenha são obrigatórios'
      });
    }

    if (novaSenha.length < 8) {
      return res.status(400).json({
        error: 'A nova senha deve ter pelo menos 8 caracteres'
      });
    }

    await userService.resetPassword(email, token, novaSenha);

    return res.status(200).json({
      message: 'Senha redefinida com sucesso'
    });
  } catch (error) {
    const status = error.message === 'Token inválido ou expirado' ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
}

export async function updateUserPhoto(req, res) {
  try {
    const userId = Number(req.params.id);
    const { foto } = req.body ?? {};

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({ error: 'ID do usuário inválido' });
    }

    if (!foto || typeof foto !== 'string') {
      return res.status(400).json({ error: 'foto é obrigatória e deve ser texto' });
    }

    if (Number(req.user.id) !== userId && req.user.role !== 'ADM') {
      return res.status(403).json({
        error: 'Você só pode atualizar sua própria foto'
      });
    }

    const user = await userService.updateUserPhoto(userId, foto);

    return res.status(200).json({
      message: 'Foto atualizada com sucesso',
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Não foi possível atualizar a foto'
    });
  }
}
