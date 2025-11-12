import { getConnection } from "../db.js";

// Listar produtos ativos
export async function listarProdutos() {
  const connection = await getConnection();
  const [rows] = await connection.query(
    `
    SELECT p.*, c.nome AS categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON p.categorias_idCategorias = c.idCategorias
    WHERE p.ativo = 1
    `
  );
  await connection.end();
  return rows;
}

// Buscar produto por ID
export async function buscarProdutoPorId(id) {
  const connection = await getConnection();
  const [rows] = await connection.query(
    `
    SELECT p.*, c.nome AS categoria_nome
    FROM produtos p
    LEFT JOIN categorias c ON p.categorias_idCategorias = c.idCategorias
    WHERE p.idProdutos = ? AND p.ativo = 1
    `,
    [id]
  );
  await connection.end();
  return rows[0];
}

// Adicionar novo produto
export async function adicionarProduto(nome, preco, categoriaId) {
  const connection = await getConnection();
  const [result] = await connection.query(
    `INSERT INTO produtos (nome, preco, ativo, categorias_idCategorias)
     VALUES (?, ?, 1, ?)`,
    [nome, preco, categoriaId]
  );
  await connection.end();
  return result.insertId;
}

// Atualizar produto
export async function atualizarProduto(id, nome, preco, categoriaId) {
  const connection = await getConnection();
  const [result] = await connection.query(
    `
    UPDATE produtos 
    SET nome = ?, preco = ?, categorias_idCategorias = ? 
    WHERE idProdutos = ?
    `,
    [nome, preco, categoriaId, id]
  );
  await connection.end();
  return result.affectedRows > 0;
}

// "Remover" produto (soft delete)
export async function desativarProduto(id) {
  const connection = await getConnection();
  const [result] = await connection.query(
    `UPDATE produtos SET ativo = 0 WHERE idProdutos = ?`,
    [id]
  );
  await connection.end();
  return result.affectedRows > 0;
}
