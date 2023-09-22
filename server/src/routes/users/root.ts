import Express from "express";

import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/users", router);

    Util.route(router, "/", { get });

    import("./id.js").then(m => m.register(router));
}

const get: Express.RequestHandler = (req, res) => {
    if (req.user === undefined)
    {
        res.status(401).send("Must be logged in to see current user");
        return;
    }

    res.redirect(`./${req.user.id}`);
}
