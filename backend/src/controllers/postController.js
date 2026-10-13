import * as postService from "../services/postService.js";
import * as userModel from "../models/userModel.js";

// Retorna { value } ou { error }. undefined/ausente => value undefined;
// null, "" ou "todos" => aviso geral (null); numero => id de um PARENT ativo.
async function resolveDestinatario(raw) {
  if (raw === undefined) return { value: undefined };
  if (raw === null || raw === "" || raw === "todos") return { value: null };

  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "destinatario_id inválido" };
  }

  const user = await userModel.findById(id);
  if (!user || user.role !== "PARENT") {
    return { error: "destinatario_id deve ser um responsável (PARENT) existente" };
  }

  return { value: id };
}

function canView(user, post) {
  return (
    user.role !== "PARENT" ||
    post.destinatario_id === null ||
    post.destinatario_id === user.id
  );
}

export async function createPost(req, res) {
  try {
    const { titulo, conteudo } = req.body;

    if (!titulo || !conteudo) {
      return res.status(400).json({
        error: "titulo e conteudo são obrigatórios"
      });
    }

    const dest = await resolveDestinatario(req.body.destinatario_id);
    if (dest.error) {
      return res.status(400).json({ error: dest.error });
    }

    const post = await postService.createPost({
      titulo,
      conteudo,
      autor_id: req.user.id,
      destinatario_id: dest.value ?? null
    });

    return res.status(201).json({
      message: "Post criado com sucesso",
      data: post
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar post"
    });
  }
}

export async function listPosts(req, res) {
  try {
    const posts = await postService.getPosts({
      forUserId: req.user.role === "PARENT" ? req.user.id : null
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao buscar posts"
    });
  }
}

export async function getPost(req, res) {
  try {
    const { id } = req.params;

    const post = await postService.getPostById(id);

    if (!post || !canView(req.user, post)) {
      return res.status(404).json({
        error: "Post não encontrado"
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao buscar post"
    });
  }
}

export async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;

    if (!titulo || !conteudo) {
      return res.status(400).json({
        error: "titulo e conteudo são obrigatórios"
      });
    }

    const post = await postService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: "Post não encontrado"
      });
    }

    if (
      req.user.role !== "ADM" &&
      post.autor_id !== req.user.id
    ) {
      return res.status(403).json({
        error: "Você não pode editar este post"
      });
    }

    const dest = await resolveDestinatario(req.body.destinatario_id);
    if (dest.error) {
      return res.status(400).json({ error: dest.error });
    }

    const updatedPost = await postService.updatePost(id, {
      titulo,
      conteudo,
      destinatario_id: dest.value
    });

    return res.status(200).json({
      message: "Post atualizado com sucesso",
      data: updatedPost
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao atualizar post"
    });
  }
}

export async function deletePost(req, res) {
  try {
    const { id } = req.params;

    const post = await postService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: "Post não encontrado"
      });
    }

    if (
      req.user.role !== "ADM" &&
      post.autor_id !== req.user.id
    ) {
      return res.status(403).json({
        error: "Você não pode excluir este post"
      });
    }

    await postService.deletePost(id);

    return res.status(200).json({
      message: "Post excluído com sucesso"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao excluir post"
    });
  }
}
