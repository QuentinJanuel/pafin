import { db } from "@/db";
import { Env } from "@/env";
import { wrapMiddleware } from "@/server/async-handler";
import { HttpCode } from "@/server/http-code";
import { reqError } from "@/server/req-error";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = Env.get("JWT_SECRET");

export const getToken = (id: string) => sign({ id }, JWT_SECRET);

export const auth = wrapMiddleware(async (req, res, next) => {
    const token = req.getBearerToken();
    if (!token)
        throw reqError(HttpCode.UNAUTHORIZED, "Missing token");
    const { id } = verify(token, JWT_SECRET) as {
        id: string | undefined;
    };
    if (!id)
        throw reqError(HttpCode.UNAUTHORIZED, "Invalid token");
    const count = await db.user.count({ where: { id } });
    if (count === 0)
        throw reqError(HttpCode.UNAUTHORIZED, "Invalid token");
    req.setUserId(id);
    next();
});
