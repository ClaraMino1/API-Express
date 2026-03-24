import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import usersRouter from "./routers/users.routes.js";
import sessionsRouter from "./routers/sessions.routes.js"
import viewsRouter from "./routers/views.routes.js"
import MongoSingleton from "./config/database.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.js";
import { env } from "./config/env.js";
import cors from "cors";

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
initializePassport();
app.use(passport.initialize());

app.use(session({
    cookie: {
        maxAge: 3600000,
        httpOnly: true
    },
    store: MongoStore.create({
        mongoUrl: env.MONGO_URL,
        ttl: 60,
        autoRemove: "interval",
        autoRemoveInterval: 70
    }),
    secret: env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.session());

app.use(cors({origin: ['http://127.0.0.1:5500']}));

app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

app.listen(env.PORT, () => {
    console.log(`servidor escuchando en el puerto ${env.PORT}`);
    MongoSingleton.getInstance();
});