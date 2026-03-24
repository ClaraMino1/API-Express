import { hashPassword } from "../../utils.js"

export class UsersDTO {
    sessionData(user) {
        return {
            first_name: user.first_name,
            email: user.email,
            role: user.role
        }
    }

    saveUser(user) {
        return {
            _id: user._id,
            first_name: user.first_name,
            password: hashPassword(user.password),
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
    }
}