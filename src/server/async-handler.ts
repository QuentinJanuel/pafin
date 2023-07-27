import type {
    Request,
    Response,
    NextFunction,
} from "express-serve-static-core";
import { ReqError } from "./req-error";
import { HttpCode } from "./http-code";

type Fn<T> = (req: Request, res: Response) => T;
type FnMiddleware<T> = (
    req: Request,
    res: Response,
    next: NextFunction,
) => T;

const errorHandler = (err: ReqError, res: Response) => {
    const code = err.code ?? HttpCode.INTERNAL;
    const message = err.message ?? "Internal server error";
    res.status(code).json({ error: message });
};

export const wrap = (
    fn: Fn<Promise<void>>
): Fn<void> => (req, res) => {
    fn(req, res)
        .catch(err => errorHandler(err, res));
};

export const wrapMiddleware = (
    fn: FnMiddleware<Promise<void>>
): FnMiddleware<void> => (req, res, next) => {
    fn(req, res, next)
        .catch(err => errorHandler(err, res));
};
