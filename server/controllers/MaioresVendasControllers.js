import { getMaioresVendas } from "../models/MaioresVendas"; 

export async function maioresVendasController() {
  try {
    const result = await getMaioresVendas();
    console.log("DEBUG vendas recebidas:", resposta.vendas);
    return result;
  } catch (err) {
    return { success: false, message: "Erro ao buscar vendas." };
  }
}
