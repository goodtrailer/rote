import Express from "express";
import Passport from "passport";

import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/login", router);

    Util.route(router, "/", { get, post });
}

const get: Express.RequestHandler = (_req, res) => {
    res.render("login");
};

const post: Express.RequestHandler = Passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
});
