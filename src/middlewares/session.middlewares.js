import {validateToken} from "../utils.js";
import { env } from "../config/env.js";

export async function validateSession(req, res, next){
    if(req.session && req.session.user){
        next();
    }
    else{
        res.redirect("/login");
    }
}

/**
 * 
 * @param {import("express").Request} Req
 * @param {*} res
 * @param {*} next 
 */

export async function validateJwtSession(req,res,next){
    if(req.cookies.jwt){
        const user =  validateToken(req.cookies.jwt, env.JWT_SECRET);
        req.user = user;
        next();
    }else{

    }
}