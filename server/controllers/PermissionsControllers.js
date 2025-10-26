import { getUserTables } from "../models/Permissions.js";

export async function permissionsController() {
  try {
    const result = await getUserTables();
    return result;
  } catch (err) {
    return { success: false, message: "Erro ao buscar tabelas." };
  }
}
