import bcrypt from "bcrypt"
import { db } from "../database/database.connection.js";

export async function signup(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);

    if (user.rowCount !== 0) {
      return res.status(409).json({ message: "E-mail já foi cadastrado!" });
    }

    const hash = bcrypt.hashSync(password, 10);

    await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, hash]
    );

    res.status(201).json({ message: "Usuário criado com sucesso!" });

  } catch (err) {
    res.status(500).json(err.message);
  }
}

