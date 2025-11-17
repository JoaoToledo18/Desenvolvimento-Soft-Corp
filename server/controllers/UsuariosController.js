import {
  listarUsuariosComPermissoes,
  atualizarPermissaoUsuario,
  criarUsuarioMySQL,
  desativarUsuario,
} from "../models/Usuarios.js";

import { getConnection } from "../db.js";
import bcrypt from "bcrypt";
import { canUser } from "./PermissoesController.js";

// A tabela correta para validação:
const tabela = "usuarios";

// 🔹 Função que insere usuário local
async function criarUsuario(nome, login, senhaHash) {
  const connection = await getConnection();
  const [result] = await connection.query(
    "INSERT INTO usuarios (nome, login, senha, ativo) VALUES (?, ?, ?, 1)",
    [nome, login, senhaHash]
  );
  await connection.end();
  return result.insertId;
}

// 📌 Formatar os dados recebidos do banco
function formatarUsuarios(rows) {
  const usuarios = new Map();

  rows.forEach((row) => {
    if (!usuarios.has(row.idUsuarios)) {
      usuarios.set(row.idUsuarios, {
        idUsuario: row.idUsuarios,
        nome: row.nome,
        login: row.login,
        ativo: row.ativo,
        permissoes: {},
      });
    }

    usuarios.get(row.idUsuarios).permissoes[row.tabela] = {
      idPermissao: row.idPermissoes,
      permisaoSelect: row.permissaoSelect,
      permisaoInsert: row.permissaoInsert,
      permisaoUpdate: row.permissaoUpdate,
      permisaoDelete: row.permissaoDelete,
    };
  });

  return [...usuarios.values()];
}

// 📌 Listar usuários
export async function listarUsuarios() {
  if (!canUser(tabela, "select")) {
    return { success: false, message: "Sem permissão para listar usuários." };
  }

  try {
    const dados = await listarUsuariosComPermissoes();
    return { success: true, data: formatarUsuarios(dados) };
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    return { success: false, message: "Erro interno ao listar usuários." };
  }
}

// 📌 Criar novo usuário
export async function criarNovoUsuario(nome, login, senha) {
  if (!canUser(tabela, "insert")) {
    return { success: false, message: "Sem permissão para criar usuário." };
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const idUsuario = await criarUsuario(nome, login, senhaHash);

    await criarUsuarioMySQL(login, senha);

    return { success: true, id: idUsuario };
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return { success: false, message: "Erro interno ao criar usuário." };
  }
}

// 📌 Atualizar permissões do usuário
export async function alterarPermissoesUsuario(idUsuario, idPermissao, permissoes) {
  if (!canUser(tabela, "update")) {
    return { success: false, message: "Sem permissão para alterar permissões." };
  }

  try {
    const result = await atualizarPermissaoUsuario(idUsuario, idPermissao, permissoes);

    if (!result.success) {
      return { success: false, message: result.message };
    }

    return { success: true, message: "Permissão atualizada com sucesso." };
  } catch (err) {
    console.error("Erro ao alterar permissões:", err);
    return { success: false, message: "Erro interno ao alterar permissões." };
  }
}

// 📌 Desativar usuário
export async function removerUsuario(idUsuario) {
  if (!canUser(tabela, "delete")) {
    return { success: false, message: "Sem permissão para desativar usuário." };
  }

  try {
    const ok = await desativarUsuario(idUsuario);
    return ok
      ? { success: true, message: "Usuário desativado." }
      : { success: false, message: "Usuário não encontrado ou já desativado." };
  } catch (err) {
    console.error("Erro ao desativar usuário:", err);
    return { success: false, message: "Erro interno ao desativar usuário." };
  }
}
