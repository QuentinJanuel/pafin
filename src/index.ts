import express from "express";
import { getNumber } from "./env";
import { logger } from "./logger";
import { db } from "./db";
import { HttpCode } from "./http-code";

const PORT = getNumber("PORT");

const app = express();
app.use(express.json());

app.get("/", async (_req, res) => {
    try {
        const users = await db.user.findMany();
        res.json({ users });
    } catch (error) {
        logger.error(error);
        res
            .status(HttpCode.INTERNAL)
            .json({ message: "Failed to get users." });
    }
});

app.get("/new-user", async (_req, res) => {
    try {
        await db.user.create({
            data: {
                email: "some@email.com",
                name: "Some Name",
                password: "some-password",
            },
        });
        res
            .status(HttpCode.CREATED)
            .json({ message: "Created a new user!" });
    } catch (error) {
        logger.error(error);
        res
            .status(HttpCode.INTERNAL)
            .json({ message: "Failed to create a new user." });
    }
});

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
});
