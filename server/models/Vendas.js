import { getConnection } from "../db.js";

export async function listarVendasComItens() {
  const connection = await getConnection();

  const [vendas] = await connection.query(
    `SELECT v.idVendas, v.dataVenda, v.status, v.nome, 
            u.nome AS usuario_nome,
            SUM(iv.quantidade * iv.precoUnitario) AS totalVenda
     FROM vendas v
     LEFT JOIN usuarios u ON u.idUsuarios = v.usuarios_idUsuarios
     LEFT JOIN itensVendas iv ON iv.vendas_idVendas = v.idVendas
     GROUP BY v.idVendas
     ORDER BY v.dataVenda DESC`
  );

  for (let venda of vendas) {
    const [itens] = await connection.query(
      `SELECT iv.quantidade, iv.precoUnitario, 
              p.nome AS produto_nome
       FROM itensVendas iv
       LEFT JOIN produtos p ON iv.produtos_idProdutos = p.idProdutos
       WHERE iv.vendas_idVendas = ?`,
      [venda.idVendas]
    );

    venda.itens = itens.map((item) => ({
      nome: item.produto_nome,
      quantidade: item.quantidade,
      preco: item.precoUnitario,
    }));
  }

  await connection.end();
  return vendas;
}

export async function buscarVendaPorId(id) {
  const connection = await getConnection();

  const [vRows] = await connection.query(
    `SELECT v.*, u.nome AS usuario_nome
     FROM vendas v
     LEFT JOIN usuarios u ON u.idUsuarios = v.usuarios_idUsuarios
     WHERE idVendas = ?`,
    [id]
  );

  if (!vRows.length) {
    await connection.end();
    return null;
  }

  const [itens] = await connection.query(
    `SELECT iv.*, p.nome AS produto_nome
     FROM itensVendas iv
     LEFT JOIN produtos p ON iv.produtos_idProdutos = p.idProdutos
     WHERE vendas_idVendas = ?`,
    [id]
  );

  await connection.end();
  return {
    ...vRows[0],
    itens,
  };
}

export async function excluirVenda(id) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM itensVendas WHERE vendas_idVendas = ?`,
      [id]
    );

    const [res] = await connection.query(
      `DELETE FROM vendas WHERE idVendas = ?`,
      [id]
    );

    await connection.commit();
    await connection.end();
    return res.affectedRows > 0;
  } catch (err) {
    await connection.rollback();
    await connection.end();
    throw err;
  }
}
