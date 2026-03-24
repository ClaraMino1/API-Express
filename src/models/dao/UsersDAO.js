import { userModel } from "../userModel.js"

class UsersDAO {

    async getAll(){
        return await userModel.find({});
    }

    async updateByEmail(email,update){
        return await userModel.updateOne({email}, update);
    }

    async deleteByEmail(email){
        return await userModel.deleteOne({email});
    }

    async findByEmail(email) {
        return userModel.findOne({ email }).lean();
    }

    async create(user) {
        return userModel.create(user);
    }
}

export default new UsersDAO(); 