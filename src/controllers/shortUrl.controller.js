import { db } from "../database/database.connection.js";
import { customAlphabet, urlAlphabet } from 'nanoid'



export async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals;

  const nanoidGenerator = customAlphabet(urlAlphabet, 8);
  const shortUrl = nanoidGenerator();

  try {
    const { rows } = await db.query(
      `INSERT INTO urls (url, "shortUrl", "userId") 
      VALUES ($1, $2, $3) 
      ON CONFLICT (url) DO NOTHING
      RETURNING id, "shortUrl";`,
      [url, shortUrl, userId]
    );

    if (rows.length === 0) {
      return res.status(409).send({ message: 'URL já cadastrada.' });
    }

    const { id } = rows[0];
    res.status(201).send({ id, shortUrl });
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
  const { id } = req.params;
  const { userId } = res.locals;

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
