import Express from "express";

import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/logout", router);

    Util.route(router, "/", { get, post });
}

const get: Express.RequestHandler = (_req, res) => {
    res.render("logout");
};

const post: Express.RequestHandler = (req, res, next) => {
    req.logout(e => {
        if (e)
            next(e);

        res.redirect("/");
    });
};
