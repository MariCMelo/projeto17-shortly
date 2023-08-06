import { searchSession } from "../controllers/session.controller";

export async function validateAuth (res, res, next) {
    const {auth} = req.headers;

    const token = auth?.replace("Bearer ", "")
    if (!token) return res.sendStatus(401)

    try {
        const session = await searchSession(token)
        if (session.rowCount === 0) return res.sendStatus(401)
        res.locals.userId = session.rows[0].userId
    } catch (err) {
        res.status(500).send(err)
    }
}