import { Router } from "express";
import { validateJwtSession, validateSession } from "../middlewares/session.middlewares.js";
import passport from "passport";
import { customPassportCall } from "../utils.js";

const router = Router();

router.get("/login", async (req, res) => {
    res.render("login");
});

router.get("/register", async (req, res) => {
    res.render("register");
});

router.get("/failed-register", async (req, res) => {
    res.send("el registro falló, intente de nuevo")
});


router.use(customPassportCall("jwt"));

router.get("/profile", async (req, res) => {
    res.render("profile", {
        user: req.user
    });
});

export default router;