const Usuario = require("../models/User");

class UsuarioController {
  static async login(usuario, senha) {
    try {
      const user = await Usuario.autenticar(usuario, senha);
      if (!user) {
        return { sucesso: false, mensagem: "Usuário ou senha incorretos!" };
      }
      return { sucesso: true, usuario: user };
    } catch (error) {
      console.error("Erro no login:", error);
      return { sucesso: false, mensagem: "Erro interno no servidor" };
    }
  }
}

module.exports = UsuarioController;
