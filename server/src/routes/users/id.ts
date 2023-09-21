import Express from "express";

import * as Db from "#~/lib/db.js";
import * as Models from "#~/models/models.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/", router);

    Util.route(router, "/:id(\\d+)", { get });
}

const get: Express.RequestHandler = async (req, res, next) => {
    type ResponseBodyType = {
        user: Shared.User,
        flashcardsets: Shared.Flashcardset[],
    };

    try {
        const id = Number(req.params.id);

        const user = await Db.Pg<Models.User>("users")
            .where("id", id)
            .first();
        
        if (user === undefined)
        {
            res.status(404);
            throw new ReferenceError("No user with given id found");
        }

        const beginQ = req.query["begin"];
        const begin = (typeof beginQ === "string" && Number.isInteger(+beginQ))
            ? +beginQ
            : 0;
    
        const countQ = req.query["count"];
        const count = typeof countQ === "string" && Number.isInteger(+countQ)
            ? Math.max(1, +countQ)
            : 25;

        const sets = await Db.Pg<Models.Flashcardset>("flashcardsets")
            .where("creatorId", id)
            .orderBy("createDate", "desc")
            .offset(begin)
            .limit(count);

        const u = Util.reduce(user, Shared.User);
        const s = sets.map(s => Util.reduce(s, Shared.Flashcardset));

        const body: ResponseBodyType = { user: u, flashcardsets: s};
        res.json(body);
    } catch (e) {
        Util.error(e);
        next(e);
    }
}
