import { db } from "../database/database.connection.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export async function signin(req, res) {
  const { email, password } = req.body;

  try {
    console.log("teste")
    const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);

    if (!user.rows[0]) {
      return res.status(401).json({ message: "E-mail e/ou senha inválidos." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Senha incorreta!" });
    }

    const token = uuid();
    await db.query(`INSERT INTO sessions ("userId", token) VALUES ($1, $2);`, [
      user.rows[0].id,
      token,
    ]);

    res.json({ token });
  } catch (err) {
    res.status(500).json(err.message);
  }
}
