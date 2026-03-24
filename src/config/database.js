import { connect } from "mongoose";
import { env } from "../config/env.js";

export default class MongoSingleton{
    static #instance;
    constructor(){
        connect(env.MONGO_URL);
    }

    static getInstance(){
        if(this.#instance){
            console.log("already connected");
            return this.#instance
        }
        this.#instance = new MongoSingleton();
        console.log("connecting");
        return this.#instance;
    }
}
