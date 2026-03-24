import { model, Schema, Types } from "mongoose";

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
        type: Types.ObjectId,
        ref: "carts"
    },
    role:{
        type: String,
        enum:["user", "admin"],
        default: "user"
    }

});

export const userModel = model("user", userSchema);