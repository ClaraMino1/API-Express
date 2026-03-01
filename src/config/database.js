import { connect } from "mongoose";
import { env } from "../config/env.js";

export async function mongoConnect(){
    await connect(env.MONGO_URL);
}