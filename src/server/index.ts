import express from "express";
import { router } from "../router";
import { HttpCode } from "./http-code";

export const app = express();
app.use(express.json());
app.use(router);
app.use((_req, res) => {
    res.status(HttpCode.NOT_FOUND).json({ error: "Not found" });
});
