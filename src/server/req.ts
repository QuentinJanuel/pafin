import { Request } from "express";
import { reqError } from "./req-error";
import { HttpCode } from "./http-code";

/**
 * A wrapper for the Express request object.
 */
export class Req {
    private readonly req: Request;

    /**
     * Creates a new Req instance.
     * @param request The Express request object.
     */
    public constructor (private readonly request: Request) {
        this.req = request;
    }

    /**
     * Gets the value of a body parameter, or returns undefined if the
     * parameter is not defined.
     * @param key The name of the body parameter.
     * @returns The value of the body parameter or undefined.
     */
    public getBodyMaybe (key: string): string | undefined {
        const value = this.req.body[key];
        if (!value || typeof value !== "string")
            return undefined;
        if (value.trim() === "")
            return undefined;
        return value ?? undefined;
    }

    /**
     * Gets the value of a body parameter, or throws an error if the
     * parameter is not defined.
     * @param key The name of the body parameter.
     * @returns The value of the body parameter.
     * @throws An error if the body parameter is not defined.
     */
    public getBody (key: string): string {
        const value = this.getBodyMaybe(key);
        if (value === undefined)
            throw reqError(
                HttpCode.BAD_REQUEST,
                `Missing body parameter: ${key}`,
            );
        return value;
    }

    /**
     * Gets the value of a body parameter as a number, or returns undefined
     * if the parameter is not defined.
     * @param key The name of the body parameter.
     * @returns The value of the body parameter as a number or undefined.
     * @throws An error if the body parameter is not a number.
     */
    public getBodyNumberMaybe (key: string): number | undefined {
        const value = this.getBodyMaybe(key);
        if (value === undefined)
            return undefined;
        const valueNum = Number(value);
        if (isNaN(valueNum))
            throw reqError(
                HttpCode.BAD_REQUEST,
                `Body parameter is not a number: ${key}`,
            );
        return valueNum;
    }

    /**
     * Gets the value of a body parameter as a number, or throws an error
     * if the parameter is not defined.
     * @param key The name of the body parameter.
     * @returns The value of the body parameter as a number.
     * @throws An error if the body parameter is not defined or is not a
     * number.
     */
    public getBodyNumber (key: string): number {
        const value = this.getBodyNumberMaybe(key);
        if (value === undefined)
            throw reqError(
                HttpCode.BAD_REQUEST,
                `Missing body parameter: ${key}`,
            );
        return value;
    }

    /**
     * Gets the value of a route parameter, or returns undefined if the
     * parameter is not defined.
     * @param key The name of the route parameter.
     * @returns The value of the route parameter or undefined.
     */
    public getParamMaybe (key: string): string | undefined {
        const value = this.req.params[key];
        if (!value || typeof value !== "string")
            return undefined;
        if (value.trim() === "")
            return undefined;
        return value ?? undefined;
    }

    /**
     * Gets the value of a route parameter, or throws an error if the
     * parameter is not defined.
     * @param key The name of the route parameter.
     * @returns The value of the route parameter.
     * @throws An error if the route parameter is not defined.
     */
    public getParam (key: string): string {
        const value = this.getParamMaybe(key);
        if (value === undefined)
            throw reqError(
                HttpCode.BAD_REQUEST,
                `Missing route parameter: ${key}`,
            );
        return value;
    }
}
