import { dirname } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import { env } from "./config/env.js";

const filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(filePath);

export default __dirname;

export function generateToken(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
    }, env.JWT_SECRET);
}

export function validateToken(token, secret) {
    return jwt.verify(token, secret);
}

export function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export function verifyPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}

export function cookieExtractor(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt"]; 
    }
    return token;
}

export function customPassportCall(strategy) {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) return next(error)
            if (!user) {
                return res.status(401).json({ error: info.messages })
            }
            req.user = user;
            next();
        })(req, res, next)
    }
}