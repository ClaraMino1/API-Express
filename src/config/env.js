import { config } from "dotenv";
config();

export const env = {
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_CLIENT: process.env.GITHUB_CLIENT,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    GITHUB_CALLBACKURL: process.env.GITHUB_CALLBACKURL
}