import { getConnection } from "../db.js";
import bcrypt from "bcrypt";

    //Busca todos os funcionarios
export async function getAllFuncionarios() {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query(
      `SELECT f.idFuncionario, f.nome, f.login, fun.nomeFuncao
       FROM funcionarios f
       JOIN funcoes fun ON fun.idFuncao = f.idFuncao`
    );

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
        //Busca os privilégios da função
    const [funcoes] = await connection.query(
      "SELECT privilegios FROM funcoes WHERE idFuncao = ?",
      [idFuncao]
    );

    if (funcoes.length === 0) {
      throw new Error("Função não encontrada.");
    }

    const privilegios = funcoes[0].privilegios; 

    const senhaHash = await bcrypt.hash(senha, 10);

    //Escapa identificadores para evitar injeção
    const usuarioMysql = connection.escapeId(login);
    const senhaMysql = connection.escape(senha);

    await connection.query(
      `CREATE USER IF NOT EXISTS ${usuarioMysql}@'%' IDENTIFIED BY ${senhaMysql}`
    );

    //Aplica as permissões com base na função
    await connection.query(
      `GRANT ${privilegios} ON seu_banco_de_dados.* TO ${usuarioMysql}@'%'`
    );

    await connection.query("FLUSH PRIVILEGES");

    //Registra o funcionário na tabela 
    const [result] = await connection.query(
      "INSERT INTO funcionarios (nome, login, senha, idFuncao) VALUES (?, ?, ?, ?)",
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

export async function updateFuncionario({ idFuncionario, nome, login, senha, idFuncao }) {
  const connection = await getConnection();
  try {
    let query, params;

    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      query = "UPDATE funcionarios SET nome = ?, login = ?, senha = ?, idFuncao = ? WHERE idFuncionario = ?";
      params = [nome, login, senhaHash, idFuncao, idFuncionario];
    } else {
      query = "UPDATE funcionarios SET nome = ?, login = ?, idFuncao = ? WHERE idFuncionario = ?";
      params = [nome, login, idFuncao, idFuncionario];
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


 //Exclui um funcionário e o respectivo usuário MySQL.

export async function deleteFuncionario(idFuncionario) {
  const connection = await getConnection();
  try {
    //Busca o login do funcionário antes de excluir
    const [rows] = await connection.query(
      "SELECT login FROM funcionarios WHERE idFuncionario = ?",
      [idFuncionario]
    );

    if (rows.length === 0) {
      throw new Error("Funcionário não encontrado.");
    }

    const login = rows[0].login;
    const usuarioMysql = connection.escapeId(login);

    //Remove o usuário do MySQL
    await connection.query(`DROP USER IF EXISTS ${usuarioMysql}@'%'`);

    //Remove o funcionário da tabela
    const [result] = await connection.query(
      "DELETE FROM funcionarios WHERE idFuncionario = ?",
      [idFuncionario]
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
