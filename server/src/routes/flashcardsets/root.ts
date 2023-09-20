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
    try
    {
        const beginQ = req.query["begin"];
        const begin = (typeof beginQ === "string" && Number.isInteger(+beginQ))
            ? +beginQ
            : 0;
    
        const countQ = req.query["count"];
        const count = typeof countQ === "string" && Number.isInteger(+countQ)
            ? Math.max(1, +countQ)
            : 25;

        const sets = await Db.Pg<Models.Flashcardset>("flashcardsets")
            .orderBy("createDate", "desc")
            .offset(begin)
            .limit(count);

        console.log(`User: ${JSON.stringify(req.user)}`);
    
        const s = sets.map(s => Util.reduce(s, Shared.Flashcardset));
        res.json(s);
    } catch (e) {
        Util.error(e);
        next(e);
    }
};

const post: Express.RequestHandler = async (req, res, next) => {
    type RequestBodyType = {
        flashcardset: Omit<Shared.Flashcardset, "creatorId" | "createDate" | "stars" | "views" | "id">,
        flashcards: Omit<Shared.Flashcard, "id">[],
    };

    try {
        if (req.user === undefined)
        {
            res.status(401);
            throw new Error("Must be logged in to create a flashcardset");
        }

        if (!Typia.is<RequestBodyType>(req.body))
        {
            res.status(400);
            throw new Error("Request body is not of correct type/format");
        }

        const user = req.user;
        const flashcardset = req.body.flashcardset;
        const flashcards = req.body.flashcards;

        const nameSize = Buffer.byteLength(flashcardset.name);
        if (nameSize < 8 || nameSize > 80)
        {
            res.status(400);
            throw new RangeError("Name not 8 to 80 bytes long");
        }

        const descriptionSize = Buffer.byteLength(flashcardset.description);
        if (descriptionSize < 8 || descriptionSize > 80)
        {
            res.status(400);
            throw new RangeError("Description not 8 to 80 bytes long");
        }

        for (let i = 0; i < flashcards.length; i++)
        {
            const f = flashcards[i];

            const frontSize = Buffer.byteLength(f.front);
            if (frontSize < 8 || frontSize > 3000)
            {
                res.status(400);
                throw new RangeError("Front not 8 to 3000 bytes long; idx = " + i);
            }

            const backSize = Buffer.byteLength(f.front);
            if (backSize < 8 || backSize > 3000)
            {
                res.status(400);
                throw new RangeError("Back not 8 to 3000 bytes long; idx = " + i);
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
            .set("Location", `flashcardsets/${setId}`)
            .end();
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
