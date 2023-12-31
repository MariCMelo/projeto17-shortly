import { db } from "../database/database.connection.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet('1234567890abcdef', 8);

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
 console.log(result)
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

export async function openShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const result = await db.query(`SELECT url FROM urls WHERE "shortUrl"=$1;`, [
      shortUrl,
    ]);

    const url = result.rows[0];

    if (!url) {
      return res.status(404).json({ message: "URL encurtada não encontrada!" });
    }

    db.query(
      `UPDATE urls SET "visitCount" = "visitCount" + 1 WHERE "shortUrl"=$1;`,
      [shortUrl]
    );

    res.redirect(url.url);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteUrl(req, res) {
  const id = req.params.id;
  const { userId } = res.locals;

  console.log(id)
  try {
    const result = await db.query(
      `SELECT id FROM urls WHERE id = $1 AND "userId" = $2;`,
      [id, userId]
    );

    const url = result.rows[0];

    if (!url) {
      return res.status(404).json({ message: "URL não existe!" });
    }

    if (url.id !== userId) {
      return res
        .status(401)
        .json({ message: "URL encurtada não pertence ao usuário." });
    }

    await db.query(`DELETE FROM urls WHERE id = $1;`, [id]);
  } catch (err) {
    res.status(500).json(err.message);
  }
}
