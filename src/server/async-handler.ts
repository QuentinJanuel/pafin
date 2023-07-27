import type {
    Request,
    Response,
    NextFunction,
} from "express-serve-static-core";
import { ReqError } from "./req-error";
import { HttpCode } from "./http-code";
import { Req } from "./req";

type Fn<T, U> = (req: T, res: Response) => U;
type FnMiddleware<T, U> = (
    req: T,
    res: Response,
    next: NextFunction,
) => U;

const errorHandler = (err: ReqError, res: Response) => {
    const code = err.code ?? HttpCode.INTERNAL;
    const message = err.message ?? "Internal server error";
    res.status(code).json({ error: message });
};

export const wrap = (
    fn: Fn<Req, Promise<void>>
): Fn<Request, void> => (req, res) => {
    fn(new Req(req), res)
        .catch(err => errorHandler(err, res));
};

export const wrapMiddleware = (
    fn: FnMiddleware<Req, Promise<void>>
): FnMiddleware<Request, void> => (req, res, next) => {
    fn(new Req(req), res, next)
        .catch(err => errorHandler(err, res));
};
