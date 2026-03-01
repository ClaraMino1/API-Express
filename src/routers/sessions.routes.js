import { Router, json, urlencoded } from "express";
import { userModel } from "../models/userModel.js";
import { generateToken, verifyPassword, customPassportCall } from "../utils.js";
import passport from "passport";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

router.get("/current", customPassportCall("jwt"), (req, res) => {
    res.json({
        message: "Usuario validado con éxito",
        user: req.user
    });
});

router.get("/github-login", passport.authenticate("github", { failureRedirect: "/login-failed", session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }).redirect("/profile");
});

router.use(urlencoded({ extended: false }));
router.use(json());

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).lean();
        if (!user) return res.status(401).send("Usuario no encontrado");

        if (verifyPassword(password, user.password)) {
            const token = generateToken(user);
            res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }).redirect("/profile");
        } else {
            res.status(401).send("Credenciales inválidas");
        }
    } catch (error) {
        res.status(500).send("Error en el servidor");
    }
});

router.post("/logout", async (req, res) => {
    req.user = null;
    res.clearCookie("jwt").send("Sesión finalizada");
});

export default router;