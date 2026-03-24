import { Router, json, urlencoded } from "express";
import passport from "passport";
import { getAll, updateUser, deleteUser } from "../controllers/users.controllers.js";
import { authorize } from "../middlewares/auth.js";
import { customPassportCall } from "../utils.js";

const router = Router();

router.get("/", getAll);

router.use(json(), urlencoded({ extended: false }));

router.post("/",
    passport.authenticate("register", {
        session: false,
        failureRedirect: "/register-failed"
    }),
    (req, res) => {
        res.redirect("/login");
    }
);

//solamente un admin puede eliminar o actualizar un usuario
router.put(
    "/",
    customPassportCall("jwt"),
    authorize(["admin"]),
    updateUser
);

router.delete(
    "/",
    customPassportCall("jwt"),
    authorize(["admin"]),
    deleteUser
);

export default router;