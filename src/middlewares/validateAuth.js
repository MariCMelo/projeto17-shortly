import { db } from "../database/database.connection.js";

export async function validateAuth(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  try {
    const session = await db.query(
      `
        SELECT user_id AS "userId" 
        FROM sessions
        WHERE token = $1;
      `,
      [token]
    );

    if (session.rowCount === 0) {
      return res.status(401).json({ message: "Token inválido." });
    }

    res.locals.userId = session.rows[0].userId;

    next();
  } catch (err) {
    res.status(500).send(err);
  }
}