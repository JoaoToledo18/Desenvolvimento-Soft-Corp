import { getConnection } from "../db.js";
import bcrypt from "bcryptjs";

export async function getFuncoes() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT nome FROM funcoes");
    console.log(rows)
    await connection.end();
    return { success: true, funcoes: rows };
  } catch (err) {
    console.error("Erro ao buscar funcao:", err.message);
    return { success: false, message: "Erro ao buscar funcao." };
  }
}

// Busca todos os funcionários
export async function getAllFuncionarios() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT u.idUsuario, u.nome, u.login, fun.nome AS nomeFuncao
      FROM usuarios u
      JOIN funcoes fun ON fun.idFuncao = u.idFuncoes
    `);
    await connection.end();
    return { success: true, funcionarios: rows };
  } catch (err) {
    console.error("Erro ao buscar funcionarios:", err.message);
    return { success: false, message: "Erro ao buscar funcionarios." };
  }
}

export async function createFuncionario({ nome, login, senha, idFuncao }) {
  const connection = await getConnection();
  try {
    // Busca os privilégios da função
    const [funcoes] = await connection.query(
      "SELECT privilegios FROM funcoes WHERE idfuncao = ?",
      [idFuncao]
    );

    console.log(nome)

    if (funcoes.length === 0) {
      throw new Error("Função não encontrada.");
    }

    const privilegios = funcoes[0].privilegios;
    const senhaHash = await bcrypt.hash(senha, 10);

    // Escapa identificadores
    const usuarioMysql = connection.escapeId(login);
    const senhaMysql = connection.escape(senha);

    await connection.query(
      `CREATE USER IF NOT EXISTS ${usuarioMysql}@'%' IDENTIFIED BY ${senhaMysql}`
    );
    await connection.query(
      `GRANT ${privilegios} ON siscorp.* TO ${usuarioMysql}@'%'`
    );
    await connection.query("FLUSH PRIVILEGES");

    // Insere funcionário
    const [result] = await connection.query(
      "INSERT INTO usuarios (nome, login, senha, idFuncoes) VALUES (?, ?, ?, ?)",
      [nome, login, senhaHash, idFuncao]
    );

    await connection.end();
    return { success: true, id: result.insertId };
  } catch (err) {
    console.error("Erro ao criar funcionario:", err.message);
    await connection.end();
    return { success: false, message: "Erro ao criar funcionario." };
  }
}

export async function updateFuncionario({ idUsuario, nome, login, senha, idFuncao }) {
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
    console.error("Erro ao atualizar funcionario:", err.message);
    await connection.end();
    return { success: false, message: "Erro ao atualizar funcionario." };
  }
}

export async function deleteFuncionario(idUsuario) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT login FROM usuarios WHERE idUsuario = ?",
      [idUsuario]
    );

    if (rows.length === 0) throw new Error("Funcionário não encontrado.");

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
    console.error("Erro ao excluir funcionario:", err.message);
    await connection.end();
    return { success: false, message: "Erro ao excluir funcionario." };
  }
}
