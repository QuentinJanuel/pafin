import type { HttpCode } from "./http-code";

export interface ReqError {
    code: HttpCode;
    message: string;
}

export const reqError = (code: HttpCode, message: string): ReqError => ({
    code,
    message,
});
