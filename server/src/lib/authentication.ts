import Bcrypt from "bcrypt";
import Express from "express";
import Passport from "passport";
import PassportLocal from "passport-local";

import * as Db from "#~/lib/db.js";
import * as Models from "#~/models/models.js";
import * as Util from "#~/lib/util.js";

declare global {
    namespace Express {
        interface User extends Models.User {
        }
    }
}

export function initialize(): Express.RequestHandler[] {
    const verify: PassportLocal.VerifyFunction = async (username, password, done) => {
        try {
            const user = await Db.Pg<Models.User>("users")
                .where("username", username)
                .first();

            if (user === undefined || !await Bcrypt.compare(password, user.passhash))
                return done(null, false, { message: "Incorrect credentials." });

            return done(null, user);
        } catch (e) {
            Util.error(e);
            return done(e);
        }
    };

    Passport.use(new PassportLocal.Strategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        verify,
    ));

    Passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    Passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await Db.Pg<Models.User>("users")
                .where("id", id)
                .first();
        
            if (user === undefined)
                throw new ReferenceError("No user with given id found");

            done(null, user);
        } catch (e) {
            Util.error(e);
            done(e);
        }
    });

    return [Passport.initialize(), Passport.session()];
}
