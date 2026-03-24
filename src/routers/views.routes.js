import { Router } from "express";
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

router.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});

router.get("/reset-password", (req, res) => {
    const { token } = req.query;

    res.render("reset-password", { token });
});


router.use(customPassportCall("jwt"));

router.get("/profile", async (req, res) => {
    res.render("profile", {
        user: req.user
    });
});

export default router;