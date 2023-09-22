import Path from "node:path";
import Url from "node:url";

import Cors from "cors";
import Express from "express";
import ExpressSession from "express-session";

import * as Constants from "#~/lib/constants.js";
import * as Authentication from "#~/lib/authentication.js";

console.log(Constants);

// Initialization

const app = Express();

app.set("views", Path.join(Path.dirname(Url.fileURLToPath(import.meta.url)), "views"));
app.set("view engine", "ejs");

// Middleware

const corsOptions: Cors.CorsOptions = {
    origin: Constants.ORIGIN,
    exposedHeaders: ["Location", "Set-Cookie"],
    credentials: true,
 };

app.use(Cors(corsOptions));
app.use(ExpressSession({ secret: Constants.SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 604800 }}));
app.use(Authentication.initialize());
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));

// Routing

(await import("./routes/root.js")).register(app);

app.use((_req: Express.Request, res: Express.Response) => {
    res.status(404).send("API endpoint does not exist");
});

app.listen(Constants.PORT, () => console.log(`Listening on port ${Constants.PORT}`));
