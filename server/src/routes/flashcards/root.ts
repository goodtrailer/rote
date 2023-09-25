import Express from "express";

import * as Db from "#~/lib/db.js";
import * as Models from "#~/models/models.js";
import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/flashcards", router);

    Util.route(router, "/", { get });
}

const get: Express.RequestHandler = async (_req, res, next) => {
    type ResponseBodyType = {
        count: number,
    };

    try {
        const total = await Db.Pg<Models.Flashcard>("flashcards")
            .count()
            .first();
            
        const t = total !== undefined ? Number(total["count"]) : 0;

        res.json({ count: t } as ResponseBodyType);
    } catch (e) {
        Util.error(e);
        next(e);
    }
}
