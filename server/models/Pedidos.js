import { getConnection, getIdUser } from "../db.js";

export async function criarVenda(nome, itens) {
  const connection = await getConnection();
  const usuarioId = getIdUser();

  if (!usuarioId) {
    throw new Error("Usuário não identificado. Faça login novamente.");
  }

  try {
    await connection.beginTransaction();

    const [resV] = await connection.query(
      `INSERT INTO vendas (nome, dataVenda, status, usuarios_idUsuarios)
       VALUES (?, NOW(), 'pendente', ?)`,
      [nome, usuarioId]
    );

    const vendaId = resV.insertId;

    const necessidadePorIngrediente = {};

    for (const item of itens) {
      const [prodRows] = await connection.query(
        `SELECT idProdutos, preco FROM produtos WHERE idProdutos = ? AND ativo = 1`,
        [item.produtoId]
      );

      if (!prodRows[0]) {
        throw new Error(`Produto inválido ou inativo (id ${item.produtoId})`);
      }

      const preco = prodRows[0].preco;

      await connection.query(
        `INSERT INTO itensVendas (quantidade, precoUnitario, vendas_idVendas, produtos_idProdutos)
         VALUES (?, ?, ?, ?)`,
        [item.quantidade, preco, vendaId, item.produtoId]
      );

      const [ingredRows] = await connection.query(
        `SELECT pi.ingredientes_idIngredientes AS ingredienteId, pi.quantidade AS quantidadePorUnidade
         FROM produtosIngredientes pi
         WHERE pi.produtos_idProdutos = ?`,
        [item.produtoId]
      );

      for (const ing of ingredRows) {
        const need = Number(ing.quantidadePorUnidade) * Number(item.quantidade);
        if (!necessidadePorIngrediente[ing.ingredienteId])
          necessidadePorIngrediente[ing.ingredienteId] = 0;
        necessidadePorIngrediente[ing.ingredienteId] += need;
      }
    }

    for (const ingredienteIdStr of Object.keys(necessidadePorIngrediente)) {
      const ingredienteId = Number(ingredienteIdStr);
      const totalDiminuir = Number(necessidadePorIngrediente[ingredienteId]);

      const [estoqueRows] = await connection.query(
        `SELECT idEstoque, qtdAtual FROM estoque WHERE ingredientes_idIngredientes = ? FOR UPDATE`,
        [ingredienteId]
      );

      if (!estoqueRows.length) {
        throw new Error(
          `Estoque insuficiente: ingrediente ${ingredienteId} não encontrado`
        );
      }

      let restanteParaDiminuir = totalDiminuir;

      for (const linha of estoqueRows) {
        if (restanteParaDiminuir <= 0) break;
        const atual = Number(linha.qtdAtual);
        const diminuir = Math.min(atual, restanteParaDiminuir);
        const novo = atual - diminuir;

        await connection.query(
          `UPDATE estoque SET qtdAtual = ? WHERE idEstoque = ?`,
          [novo, linha.idEstoque]
        );

        restanteParaDiminuir -= diminuir;
      }

      if (restanteParaDiminuir > 0) {
        throw new Error(
          `Estoque insuficiente para ingrediente ${ingredienteId}`
        );
      }
    }

    await connection.commit();
    await connection.end();
    return vendaId;
  } catch (err) {
    await connection.rollback();
    await connection.end();
    throw err;
  }
}

export async function listarVendas() {
  const connection = await getConnection();
  const [rows] = await connection.query(
    `SELECT v.*, u.nome AS usuario_nome
     FROM vendas v
     LEFT JOIN usuarios u ON v.usuarios_idUsuarios = u.idUsuarios
     ORDER BY v.dataVenda DESC`
  );
  await connection.end();
  return rows;
}

export async function buscarVendaPorId(id) {
  const connection = await getConnection();

  const [vRows] = await connection.query(
    `SELECT v.*, u.nome AS usuario_nome
     FROM vendas v
     LEFT JOIN usuarios u ON v.usuarios_idUsuarios = u.idUsuarios
     WHERE v.idVendas = ?`,
    [id]
  );

  if (!vRows[0]) {
    await connection.end();
    return null;
  }

  const venda = vRows[0];

  const [itens] = await connection.query(
    `SELECT iv.*, p.nome AS produto_nome
     FROM itensVendas iv
     LEFT JOIN produtos p ON iv.produtos_idProdutos = p.idProdutos
     WHERE iv.vendas_idVendas = ?`,
    [id]
  );

  await connection.end();
  return { ...venda, itens };
}

export async function atualizarStatusVenda(id, status) {
  const connection = await getConnection();
  const [result] = await connection.query(
    `UPDATE vendas SET status = ? WHERE idVendas = ?`,
    [status, id]
  );
  await connection.end();
  return result.affectedRows > 0;
}
