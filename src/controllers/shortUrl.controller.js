import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals;
  const shortUrl = nanoid();

  try {
    const {
      rows: [result],
    } = await db.query(
      `INSERT INTO urls (url, "shortUrl", "userId") 
                  VALUES ($1, $2, $3) 
                  RETURNING id, "shortUrl"`,
      [url, shortUrl, userId]
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getUrlId(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT id, url, "shortUrl" FROM urls WHERE id=$1;`,
      [id]
    );

    const url = result.rows[0];
    if (!url) {
      return res.status(404).json({ message: "URL encurtada não encontrada!" });
    }

    res.send(url);
  } catch (err) {
    res.status(500).json(err.message);
  }
}
