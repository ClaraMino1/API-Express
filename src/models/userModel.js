import { model, Schema } from "mongoose";

const userSchema = new Schema({
    first_name : String,
    last_name : String,
    email: {
        unique: true,
        type: String
    },
    age:{
        type: Number,
        default: 18
    },
    password:{
        required: true,
        type: String
    },
    cartId: {
        type: Number,
        default: 123
    },
    role:{
        type: String,
        enum:["user", "admin"],
        default: "user"
    }

});

export const userModel = model("user", userSchema);