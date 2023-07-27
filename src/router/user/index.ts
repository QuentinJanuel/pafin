import { Router as newRouter } from "express";
import { wrap } from "@/server/async-handler";
import { db } from "@/db";

/**
 * The router for the user route.
 */
export const router = newRouter();

router.get(
    "/",
    wrap(async (_req, res) => {
        const users = await db.user.findMany();
        res.json({ users });
    }),
);
