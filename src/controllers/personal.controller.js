import { db } from "../database/database.connection.js";

export async function getUserProfile(req, res) {
  const { userId } = res.locals;

  try {
    const userProfileData = await db.query(
      `SELECT
            users.id,
            users.name,
            SUM(urls."visitCount") AS "visitCount",
            JSON_AGG(
                JSON_BUILD_OBJECT('id', urls.id, 'url', urls.url, 'shortUrl', urls."shortUrl", 'visitCount', urls."visitCount")
            ) AS "shortenedUrls"
        FROM users
        JOIN urls ON users.id = urls."userId"
        WHERE users.id = $1
        GROUP BY users.id, users.name;
        `,
      [userId]
    );
    res.status(200).send(userProfileData.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getRanking(req, res) {
  try {
    const rankingData = await db.query(`
        SELECT users.id, users.name, 
          COALESCE(SUM(urls."visitCount"), 0) AS "visitCount", 
          COALESCE(COUNT(urls.id), 0) AS "linksCount"
        FROM users
        LEFT JOIN urls ON users.id = urls."userId"
        GROUP BY users.id, users.name
        ORDER BY "visitCount" DESC, "linksCount" DESC
        LIMIT 10;
        `);

    const ranking = rankingData.rows;
    res.status(200).json(ranking);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
