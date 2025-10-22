const db = require("../db");
const bcrypt = require("bcryptjs");

class UsuarioModel {
  static async autenticar(usuario, senha) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM usuarios WHERE login = ?";
      db.query(sql, [usuario], async (err, results) => {
        if (err) return reject(err);

        if (results.length === 0) return resolve(null);

        const user = results[0];
        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) return resolve(null);

        resolve({
          id: user.id,
          nome: user.nome,
        });
      });
    });
  }
}

module.exports = UsuarioModel;
