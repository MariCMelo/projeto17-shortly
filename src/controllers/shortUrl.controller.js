import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function shortenUrl(req, res) {
  const { urlOriginal } = req.body;
  const { userId } = res.locals;
  const urlShort = nanoid();

  try { 
    console.log(urlOriginal)
    console.log(userId)
    console.log(urlShort)

    const {
      rows: [result],
    } = await db.query(
      `INSERT INTO urls ("urlOriginal", "urlShort", "userId") 
                  VALUES ($1, $2, $3) 
                  RETURNING id, "urlShort"`,
      [urlOriginal, urlShort, userId]
    );
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
