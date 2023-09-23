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

async function lookupId(req: Express.Request, res: Express.Response) {
    const id = Number(req.params["id"]);

    const flashcardset = await Db.Pg<Models.Flashcardset>("flashcardsets")
        .where("id", id)
        .first();
    
    if (flashcardset === undefined)
        res.status(404).send("No flashcardset with given id found");

    return flashcardset;
}

const get: Express.RequestHandler = async (req, res, next) => {
    type ResponseBodyType = {
        flashcardset: Shared.Flashcardset,
        flashcards: Shared.Flashcard[],
    };

    try {
        const flashcardset = await lookupId(req, res);
        if (flashcardset === undefined)
            return;

        const flashcards = await Db.Pg<Models.Flashcard>("flashcards")
            .where("setId", flashcardset.id)
            .select();

        const s = Util.reduce(flashcardset, Shared.Flashcardset);
        
        const creator = (await Db.Pg<Models.User>("users")
            .where("id", flashcardset.creatorId)
            .first())?.username;
        
        if (creator === undefined) {
            res.status(500);
            throw new Error("Could not find creator of flashcardset");
        }
        s.creator = creator;

        const f = flashcards.map(f => Util.reduce(f, Shared.Flashcard));

        res.json({ flashcardset: s, flashcards: f } as ResponseBodyType);
    } catch (e) {
        Util.error(e);
        next(e);
    }
};

const del: Express.RequestHandler = async (req, res, next) => {
    try {
        const flashcardset = await lookupId(req, res);
        if (flashcardset === undefined)
            return;
        
        if (req.user === undefined) {
            res.status(401).send("Must be logged in to delete flashcardset");
            return;
        }

        if (req.user.id !== flashcardset.creatorId) {
            res.status(403).send("Must be creator to delete flashcardset");
            return;
        }

        await Db.Pg<Models.Flashcardset>("flashcardsets")
            .where("id", flashcardset.id)
            .del();
        
        res.end();
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
