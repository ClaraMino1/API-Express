import { Router, json, urlencoded } from "express";
import { userModel } from "../models/userModel.js";
import { hashPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.use(json(), urlencoded({extended:false}));

router.post("/", 
    passport.authenticate("register", { 
        session: false, 
        failureRedirect: "/register-failed" 
    }), 
    (req, res) => {
        res.redirect("/login");
    }
);

router.put("/", async (req, res) => {
    const {email} = req.query;
    const update = req.body;
    const updatedUser = await userModel.updateOne({email}, update);
    res.json(updatedUser);
});

router.delete("/", async (req, res) => {
    const {email} = req.body;
    const deletedUser = await userModel.deleteOne({email});

    res.json(deletedUser);
});

export default router;