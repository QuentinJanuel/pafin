import express from "express";
import { getNumber } from "./env";
import { logger } from "./logger";

const PORT = getNumber("PORT");

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
    res.json({ message: "Hello, world!" });
});

app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
});
