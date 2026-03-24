import UsersDAO from "../models/dao/UsersDAO.js";

export async function getAll (req, res){
    try {
        const users = await UsersDAO.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateUser(req,res){
   const {email} = req.query;
    const update = req.body;
    const updatedUser = await UsersDAO.updateByEmail(email, update);
    res.json(updatedUser);
}

export async function deleteUser(req,res){
    const {email} = req.body;
    const deletedUser = await UsersDAO.deleteByEmail(email);

    res.json(deletedUser);
}