import { getConnection } from "../db.js";
import bcrypt from "bcryptjs";

export async function getFuncoes() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT idFuncao, nome, privilegios FROM funcoes");
    await connection.end();
    return { success: true, funcoes: rows };
  } catch (err) {
    console.error("Erro ao buscar funções:", err.message);
    return { success: false, message: "Erro ao buscar funções." };
  }
}

export async function getAllUsuarios() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT u.idUsuario, u.nome, u.login, u.idFuncoes, f.nome AS nomeFuncao
      FROM usuarios u
      JOIN funcoes f ON f.idFuncao = u.idFuncoes
    `);
    await connection.end();
    return { success: true, usuarios: rows };
  } catch (err) {
    console.error("Erro ao buscar usuários:", err.message);
    return { success: false, message: "Erro ao buscar usuários." };
  }
}

// 🔹 Criar novo usuário
export async function createUsuario({ nome, login, senha, idFuncao }) {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();


    // 1️⃣ Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // 2️⃣ Busca os privilégios da função
    const [funcaoRows] = await connection.query(
      "SELECT nome, privilegios FROM funcoes WHERE idFuncao = ?",
      [idFuncao]
    );

    if (funcaoRows.length === 0) {
      throw new Error("Função não encontrada.");
    }

    const { nome: nomeFuncao, privilegios } = funcaoRows[0];
    const usuarioMysql = connection.escapeId(login);
    const senhaMysql = connection.escape(senha); // Usar a senha original para o MySQL

    // 3️⃣ Cria o usuário no MySQL
    await connection.query(`CREATE USER ${usuarioMysql}@'%' IDENTIFIED BY ${senhaMysql}`);

    // 4️⃣ Atribui as permissões
    if (privilegios && privilegios.trim() !== "") {
      // O privilégio deve ser uma string como "SELECT, INSERT ON db.tabela"
      await connection.query(`GRANT ${privilegios} ON siscorp.* TO ${usuarioMysql}@'%'`);
    } else {
      // Permissão básica se não houver privilégios definidos
      await connection.query(`GRANT SELECT ON siscorp.* TO ${usuarioMysql}@'%'`);
    }

    // 5️⃣ Aplica as mudanças de privilégio
    await connection.query("FLUSH PRIVILEGES");

    // 6️⃣ Agora registra o usuário na tabela de controle do sistema
    const [result] = await connection.query(
      `INSERT INTO usuarios (nome, login, senha, idFuncoes)
       VALUES (?, ?, ?, ?)`,
      [nome, login, senhaHash, idFuncao]
    );

    await connection.commit();
    return { success: true, id: result.insertId };

  } catch (err) {
    await connection.rollback();
    console.error("Erro ao criar usuário:", err.message);
    return { success: false, message: "Erro ao criar usuário: " + err.message };
  } finally {
    await connection.end();
  }
}
export async function updateUsuario({ idUsuario, nome, login, senha, idFuncao }) {
  const connection = await getConnection();
  try {
    let query, params;

    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      query = "UPDATE usuarios SET nome = ?, login = ?, senha = ?, idFuncoes = ? WHERE idUsuario = ?";
      params = [nome, login, senhaHash, idFuncao, idUsuario];
    } else {
      query = "UPDATE usuarios SET nome = ?, login = ?, idFuncoes = ? WHERE idUsuario = ?";
      params = [nome, login, idFuncao, idUsuario];
    }

    const [result] = await connection.query(query, params);
    await connection.end();

    return { success: result.affectedRows > 0 };
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err.message);
    await connection.end();
    return { success: false, message: "Erro ao atualizar usuário." };
  }
}

export async function deleteUsuario(idUsuario) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT login FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

    if (rows.length === 0) throw new Error("Usuário não encontrado.");

    const login = rows[0].login;
    const usuarioMysql = connection.escapeId(login);

    await connection.query(`DROP USER IF EXISTS ${usuarioMysql}@'%'`);
    const [result] = await connection.query(
      "DELETE FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );
    await connection.query("FLUSH PRIVILEGES");
    await connection.end();

    return { success: result.affectedRows > 0 };
  } catch (err) {
    console.error("Erro ao excluir usuário:", err.message);
    await connection.end();
    return { success: false, message: "Erro ao excluir usuário." };
  }
}