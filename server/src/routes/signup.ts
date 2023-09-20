import Bcrypt from "bcrypt";
import Express from "express";

import * as Db from "#~/lib/db.js";
import * as Models from "#~/models/models.js";
import * as Util from "#~/lib/util.js";

export function register(upper: Express.Router) {
    const router = Express.Router();
    upper.use("/signup", router);

    Util.route(router, "/", { get, post });
}

const get: Express.RequestHandler = (_req, res) => {
    res.render("signup");
};

const post: Express.RequestHandler = async (req, res, next) => {
    try {
        const username: string = req.body["username"];
        const password: string = req.body["password"];

        console.log(await Bcrypt.hash("0157", 13));

        if (username.length < 8 || username.length > 16) {
            res.status(400);
            throw new RangeError("Username not 8 to 16 bytes");
        }

        const passwordSize = Buffer.byteLength(password, "utf8");
        if (passwordSize < 8 || passwordSize > 72) {
            res.status(400);
            throw new RangeError("Password not 8 to 72 bytes");
        }

        const passhash = await Bcrypt.hash(password, 13);
        await Db.Pg<Models.User>("users").insert({ username, passhash });

        res.redirect("/");
    } catch (e) {
        Util.error(e);
        next(e);
    }
};
