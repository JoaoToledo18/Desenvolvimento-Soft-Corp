import { getMaioresVendas } from "../models/MaioresVendas"; 

export async function maioresVendasController() {
  try {
    const result = await getMaioresVendas();
    return result;
  } catch (err) {
    return { success: false, message: "Erro ao buscar vendas." };
  }
}
