const mysql = require('mysql2')

const conexao = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'unifeob@123',
    database:'gestao'
})

conexao.connect((err)=> {
    if (err) throw err
    console.log('Conectado ao Banco mysql')
})

module.exports = conexao