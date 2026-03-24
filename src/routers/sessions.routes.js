import { Router, json, urlencoded } from "express";
import { userModel } from "../models/userModel.js";
import { generateToken, verifyPassword, customPassportCall, hashPassword } from "../utils.js";
import passport from "passport";
import { UsersDTO } from "../models/dto/UsersDTO.js";
import { env } from "../config/env.js";
import { transport } from "../config/mailing.js";
import jwt from "jsonwebtoken";

const router = Router();
router.use(json());
router.use(urlencoded({ extended: true }));

router.get("/current", customPassportCall("jwt"), (req, res) => {
    const userDTO = new UsersDTO().sessionData(req.user);

    res.json({
        message: "Usuario validado con éxito",
        user: userDTO
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
            console.log("USER DESDE DB:", user);

            const token = generateToken(user);

            console.log("TOKEN GENERADO:", token);
            
            res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }).redirect("/profile");
        } else {
            res.status(401).send("Credenciales inválidas");
        }
    } catch (error) {
        console.log("ERROR EN LOGIN:", error);
        res.status(500).send("Error en el servidor");
    }
});

router.post("/logout", async (req, res) => {
    req.user = null;
    res.clearCookie("jwt")
        .redirect("/login");
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.send("Usuario no encontrado");

        const token = jwt.sign(
            { email: user.email },
            env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const link = `http://localhost:${env.PORT}/reset-password?token=${token}`;

        await transport.sendMail({
            from: env.MAILING_ACCOUNT,
            to: email,
            subject: "Recuperar contraseña",
            html: `
                <h2>Recuperar contraseña</h2>
                <a href="${link}">
                    <button>Restablecer contraseña</button>
                </a>
                <p>Expira en 1 hora</p>
            `
        });

        res.send("Correo enviado");
    } catch (error) {
        console.log("ERROR FORGOT PASSWORD:", error);
        res.status(500).send("Error en el servidor");
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email });

        if (verifyPassword(password, user.password)) {
            return res.send("No podés usar la misma contraseña");
        }

        user.password = hashPassword(password);
        await user.save();

        res.send("Contraseña actualizada");
    } catch (error) {
        console.log("ERROR RESET:", error);
        res.send("Token inválido o expirado");
    }
});

export default router;