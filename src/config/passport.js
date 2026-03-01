import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { cookieExtractor } from "../utils.js";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { userModel } from "../models/userModel.js";
import { hashPassword, verifyPassword } from "../utils.js";
import { env } from "../config/env.js";

function initializePassport() {

    passport.use("register",
        new LocalStrategy({
            passReqToCallback: true,
            usernameField: "email",
            passwordField: "password",
            session: false
        },
            async (req, email, password, done) => {
                try {
                    // HICE UN CAMBIO EN EL FRONT PARA MOSTRAR LA UTILIDAD DE
                    // passReqToCallback Y GUARDAR MAS CAMPOS DE FORMULARIO
                    const user = req.body;
                    const userExists = await userModel.findOne({ email });
                    if (userExists) {
                        console.log("ya existe una cuenta para ese mail");
                        return done(null, false);
                    }
                    const hashedPassword = hashPassword(password);
                    const newUser = await userModel.create({ ...user, password: hashedPassword });
                    return done(null, newUser);
                } catch (error) {
                    return done(error.message);
                }
            })
    )
    passport.use("login",
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            session: false
        },
            async (email, password, done) => {
                try {
                    const user = await userModel.findOne({ email }).lean();
                    if (!user) {
                        return done(null, false);
                    }
                    if (verifyPassword(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(new Error("las credenciales no coinciden"), false);
                    }
                } catch (error) {
                    return done(error.message);
                }
            })
    )

    passport.use("github", new GitHubStrategy({
        clientID: env.GITHUB_CLIENT,
        clientSecret: env.GITHUB_SECRET,
        callbackURL: env.GITHUB_CALLBACKURL
    },
        async (accessToken, refreshToken, profile, done) => {            
            const { _json } = profile;
            const user = await userModel.findOne({ email: profile._json.id }).lean();
            if (!user) {
                const newUser = await userModel.create({
                    first_name: _json.login,
                    email: _json.id,
                    password: "1"
                })
                return done(null, newUser.toJSON());
            } else {
                return done(null, user);
            }
        }
    ))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: env.JWT_SECRET
    }, async (payload, done) => {
        try {
            return done(null, payload);
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;