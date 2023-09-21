import Express from "express";

import * as Db from "#~/lib/db.js";
import * as Models from "#~/models/models.js";
import * as Shared from "rote-shared/shared.js";
import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/", router);

    Util.route(router, "/:id(\\d+)", { get, delete: del });
}

async function lookupId(req: Express.Request, res: Express.Response)
{
    const id = Number(req.params.id);

    const flashcardset = await Db.Pg<Models.Flashcardset>("flashcardsets")
        .where("id", id)
        .first();
    
    if (flashcardset === undefined) {
        res.status(404);
        throw new ReferenceError("No flashcardset with given id found");
    }

    return flashcardset;
}

const get: Express.RequestHandler = async (req, res, next) => {
    type ResponseBodyType = {
        flashcardset: Shared.Flashcardset,
        flashcards: Shared.Flashcard[],
    };

    try {
        const flashcardset = await lookupId(req, res);

        const flashcards = await Db.Pg<Models.Flashcard>("flashcards")
            .where("setId", flashcardset.id)
            .select();

        const s = Util.reduce(flashcardset, Shared.Flashcardset);
        const f = flashcards.map(f => Util.reduce(f, Shared.Flashcard));

        res.json({ flashcardset: s, flashcards: f } as ResponseBodyType);
    } catch (e) {
        Util.error(e);
        next(e);
    }
}

const del: Express.RequestHandler = async (req, res, next) => {
    try {
        const flashcardset = await lookupId(req, res);
        
        if (req.user === undefined)
        {
            res.status(401);
            throw new Error("Must be logged in to delete flashcardset");
        }

        if (req.user.id !== flashcardset.creatorId)
        {
            res.status(403);
            throw new Error("Must be creator to delete flashcardset");
        }

        await Db.Pg<Models.Flashcardset>("flashcardsets")
            .where("id", flashcardset.id)
            .del();
        
        res.end();
    } catch (e) {
        Util.error(e);
        next(e);
    }
}
