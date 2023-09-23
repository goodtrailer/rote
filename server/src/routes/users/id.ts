import Url from "node:url";
import QueryString from "node:querystring";

import Express from "express";

import * as Db from "#~/lib/db.js";
import * as Models from "#~/models/models.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/", router);

    Util.route(router, "/:id", { get });
}

const get: Express.RequestHandler = async (req, res, next) => {
    type ResponseBodyType = {
        user: Shared.User,
        count: number,
        flashcardsets: Shared.Flashcardset[],
    };

    try {
        const id = Number(req.params["id"]);

        if (isNaN(id))
        {
            const user = await Db.Pg<Models.User>("users")
                .where("username", req.params["id"])
                .first();
            
            if (user === undefined)
            {
                res.status(404).send("No user with given username found");
                return;
            }

            res.redirect(Url.format({
                pathname: `/users/${user.id}`,
                query: req.query as QueryString.ParsedUrlQueryInput,
            }));
        }

        const user = await Db.Pg<Models.User>("users")
            .where("id", id)
            .first();
        
        if (user === undefined)
        {
            res.status(404).send("No user with given id found");
            return;
        }

        const beginQ = req.query["begin"];
        const begin = (typeof beginQ === "string" && Number.isInteger(+beginQ))
            ? +beginQ
            : 0;
    
        const countQ = req.query["count"];
        const count = typeof countQ === "string" && Number.isInteger(+countQ)
            ? Math.max(1, +countQ)
            : 0;

        const sets = await Db.Pg<Models.Flashcardset>("flashcardsets")
            .where("creatorId", id)
            .orderBy("createDate", "desc")
            .offset(begin)
            .limit(count);
        
        const total = await Db.Pg<Models.Flashcardset>("flashcardsets")
            .where("creatorId", id)
            .count()
            .first();

        const u = Util.reduce(user, Shared.User);
        const s = sets.map(setModel => {
            const set = Util.reduce(setModel, Shared.Flashcardset);
            set.creator = u.username;
            return set;
        });
        const t = total !== undefined ? Number(total["count"]) : 0;

        const body: ResponseBodyType = { user: u, flashcardsets: s, count: t};
        res.json(body);
    } catch (e) {
        Util.error(e);
        next(e);
    }
}
