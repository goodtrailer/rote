import Cors from "cors";
import Express from "express";
import ExpressSession from "express-session";

import * as Constants from "#~/lib/constants.js";
import * as Authentication from "#~/lib/authentication.js";

console.log(Constants);

// Initialization

const app = Express();

// Middleware

const corsOptions: Cors.CorsOptions = {
    origin: Constants.ORIGIN,
    exposedHeaders: ["Location", "Set-Cookie"],
    credentials: true,
    maxAge: 1209600,
};

const sessionOptions: ExpressSession.SessionOptions = {
    secret: Constants.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 604800_000,
        secure: Constants.HTTPS,
    },
};

app.use(Cors(corsOptions));
app.use(ExpressSession(sessionOptions));
app.use(Authentication.initialize());
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

// Routing

(await import("./routes/root.js")).register(app);

app.use((_req: Express.Request, res: Express.Response) => {
    res.status(404).send("API endpoint does not exist");
});

app.listen(Constants.PORT, () => console.log(`Listening on port ${Constants.PORT}`));
