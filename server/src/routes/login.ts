import Express from "express";
import Passport from "passport";

import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/login", router);

    router.post("/", post, success);

    // Pass "post" in again so that it gets listed under "Allowed" header
    Util.route(router, "/", { get, post });
}

const get: Express.RequestHandler = (_req, res) => {
    res.render("login");
};

const post: Express.RequestHandler = Passport.authenticate("local", {
    failureRedirect: "/login",
});

const success: Express.RequestHandler = (_req, res) => {
    res.status(200).end();
}
