import { getConnection } from "../db.js";
import bcrypt from "bcrypt";

export async function listarUsuariosComPermissoes() {
  const connection = await getConnection();
  const query = `
    SELECT 
        u.idUsuarios AS id,
        u.nome,
        u.login,
        u.ativo,
        p.idPermissoes,
        p.tabela AS nome_tabela,
        up.permisaoSelect,
        up.permisaoInsert,
        up.permisaoUpdate,
        up.permisaoDelete
    FROM usuarios u
    LEFT JOIN usuariosPermissoes up 
        ON up.usuarios_idUsuarios = u.idUsuarios
    LEFT JOIN permissoes p 
        ON p.idPermissoes = up.permissoes_idPermissoes
    WHERE u.ativo = 1
  `;

  const [rows] = await connection.query(query);
  await connection.end();

  const usuariosMap = {};

  rows.forEach((row) => {
    if (!usuariosMap[row.id]) {
      usuariosMap[row.id] = {
        id: row.id,
        nome: row.nome,
        login: row.login,
        ativo: row.ativo,
        permissoes: [],
      };
    }

    if (row.idPermissoes) {
      usuariosMap[row.id].permissoes.push({
        idPermissoes: row.idPermissoes,
        tabela: row.nome_tabela,
        select: row.permisaoSelect,
        insert: row.permisaoInsert,
        update: row.permisaoUpdate,
        delete: row.permisaoDelete,
      });
    }
  });

  return Object.values(usuariosMap);
}

export async function atualizarPermissaoUsuario(idUsuario, permissoes) {
  const connection = await getConnection();

  for (const perm of permissoes) {
    await connection.query(
      `
      UPDATE usuariosPermissoes
      SET 
        permisaoSelect = ?, 
        permisaoInsert = ?, 
        permisaoUpdate = ?, 
        permisaoDelete = ?
      WHERE usuarios_idUsuarios = ? 
        AND permissoes_idPermissoes = ?
      `,
      [
        perm.select,
        perm.insert,
        perm.update,
        perm.delete,
        idUsuario,
        perm.idPermissoes,
      ]
    );
  }

  await connection.end();
  return true;
}

export async function criarUsuarioMySQL({ nome, login, senha }) {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const [resultado] = await connection.query(
      "INSERT INTO usuarios (nome, login, senha, ativo) VALUES (?, ?, ?, 1)",
      [nome, login, senhaCriptografada]
    );

    const idUsuario = resultado.insertId;

    const [todasPermissoes] = await connection.query(
      "SELECT idPermissoes FROM permissoes"
    );

    for (const perm of todasPermissoes) {
      await connection.query(
        `INSERT INTO usuariosPermissoes 
     (usuarios_idUsuarios, permissoes_idPermissoes, \`permisaoSelect\`, \`permisaoInsert\`, \`permisaoUpdate\`, \`permisaoDelete\`)
     VALUES (?, ?, 0, 0, 0, 0)`,
        [idUsuario, perm.idPermissoes]
      );
    }

    await connection.query(`
      CREATE USER IF NOT EXISTS '${login}'@'%' IDENTIFIED BY '${senha}';
    `);

    await connection.query(`
      GRANT ALL PRIVILEGES ON hamburgueria.* TO '${login}'@'%';
    `);

    await connection.query("FLUSH PRIVILEGES");

    await connection.commit();

    return { sucesso: true, idUsuario };
  } catch (err) {
    console.error("Erro ao criar usuário do MySQL:", err);
    await connection.rollback();
    return { sucesso: false, erro: err.message };
  } finally {
    connection.end();
  }
}
