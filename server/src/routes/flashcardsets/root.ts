import Express from "express";
import Typia from "typia";

import * as Db from "#~/lib/db.js";
import * as Models from "#~/models/models.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/flashcardsets", router);

    Util.route(router, "/", { get, post });

    import("./id.js").then(m => m.register(router));
}

const get: Express.RequestHandler = async (req, res, next) => {
    type ResponseBodyType = {
        count: number,
        flashcardsets: Shared.Flashcardset[],
    };

    try {
        const beginQ = req.query["begin"];
        const begin = (typeof beginQ === "string" && Number.isInteger(+beginQ))
            ? +beginQ
            : 0;
    
        const countQ = req.query["count"];
        const count = typeof countQ === "string" && Number.isInteger(+countQ)
            ? Math.max(0, +countQ)
            : 0;

        const sets = await Db.Pg<Models.Flashcardset>("flashcardsets")
            .orderBy("createDate", "desc")
            .offset(begin)
            .limit(count);

        const total = await Db.Pg<Models.Flashcardset>("flashcardsets")
            .count()
            .first();
            
        const t = total !== undefined ? Number(total["count"]) : 0;
        const s = await Promise.all(sets.map(async setModel => {
            const set = Util.reduce(setModel, Shared.Flashcardset);

            const creator = (await Db.Pg<Models.User>("users")
                .where("id", setModel.creatorId)
                .first())?.username;
            
            if (creator === undefined) {
                res.status(500);
                throw new Error("Could not find creator of flashcardset");
            }
            set.creator = creator;
            return set;
        }));

        res.json({ count: t, flashcardsets: s } as ResponseBodyType);
    } catch (e) {
        Util.error(e);
        next(e);
    }
};

const post: Express.RequestHandler = async (req, res, next) => {
    type RequestBodyType = {
        flashcardset: Omit<Shared.Flashcardset, "creator" | "creatorId" | "createDate" | "stars" | "views" | "id">,
        flashcards: Omit<Shared.Flashcard, "id">[],
    };

    try {
        if (req.user === undefined) {
            res.status(401).send("Must be logged in to create a flashcardset");
            return;
        }

        if (!Typia.is<RequestBodyType>(req.body)) {
            res.status(400).send("Request body is not of correct type/format");
            return;
        }

        const user = req.user;
        const flashcardset = req.body.flashcardset;
        const flashcards = req.body.flashcards;

        const nameSize = Buffer.byteLength(flashcardset.name);
        if (nameSize < 8 || nameSize > 80) {
            res.status(400).send("Name not 8 to 80 bytes long");
            return;
        }

        const descriptionSize = Buffer.byteLength(flashcardset.description);
        if (descriptionSize > 500) {
            res.status(400).send("Description over 500 bytes long");
            return;
        }

        for (let i = 0; i < flashcards.length; i++) {
            const f = flashcards[i];

            const frontSize = Buffer.byteLength(f.front);
            if (frontSize < 8 || frontSize > 3000) {
                res.status(400).send("Front over 3000 bytes long; idx = " + i);
                return;
            }

            const backSize = Buffer.byteLength(f.front);
            if (backSize < 8 || backSize > 3000) {
                res.status(400).send("Back over 3000 bytes long; idx = " + i);
                return;
            }
        }

        let setId: number | undefined = undefined;

        await Db.Pg.transaction(async trx => {
            const s = { ...flashcardset, creatorId: user.id };
            setId = (await trx<Models.Flashcardset>("flashcardsets")
                .insert(s, ["id"]))[0].id;

            const f = flashcards.map(f => {
                return { setId, ...f };
            });
            await trx<Models.Flashcard>("flashcards")
                .insert(f);
        });

        if (setId === undefined)
            throw new Error("Flashcardset id was not set");

        res.status(201)
            .set("Location", `/flashcardsets/${setId}`)
            .end();
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
