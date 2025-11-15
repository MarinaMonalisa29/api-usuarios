const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

function loadDB() {
  return JSON.parse(fs.readFileSync("db.json"));
}

function saveDB(data) {
  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
}

app.get("/usuarios", (req, res) => {
  const db = loadDB();
  res.json(db.usuarios);
});

app.post("/usuarios", (req, res) => {
  const db = loadDB();
  const novo = {
    id: Date.now(),
    nome: req.body.nome,
    email: req.body.email
  };
  db.usuarios.push(novo);
  saveDB(db);
  res.status(201).json(novo);
});

app.put("/usuarios/:id", (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);
  const usuario = db.usuarios.find(u => u.id === id);

  if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

  usuario.nome = req.body.nome ?? usuario.nome;
  usuario.email = req.body.email ?? usuario.email;

  saveDB(db);
  res.json(usuario);
});

app.delete("/usuarios/:id", (req, res) => {
  const db = loadDB();
  const id = parseInt(req.params.id);

  db.usuarios = db.usuarios.filter(u => u.id !== id);

  saveDB(db);
  res.json({ message: "Usuário removido" });
});

app.listen(3000, () => console.log("API rodando em http://localhost:3000"));

