import {
  listarUsuariosComPermissoes,
  atualizarPermissaoUsuario,
  criarUsuarioMySQL
} from "../models/Usuarios.js";

// 🔹 Listar usuários + permissões
export async function listar() {
  const usuarios = await listarUsuariosComPermissoes();
  return usuarios;
}

// 🔹 Atualizar permissões
export async function atualizar(idUsuario, permissoes) {
  const result = await atualizarPermissaoUsuario(idUsuario, permissoes);
  return result;
}

// 🔹 Criar usuário (sistema + MySQL)
export async function criar(dadosUsuario) {
  const result = await criarUsuarioMySQL(dadosUsuario);
  return result;
}
