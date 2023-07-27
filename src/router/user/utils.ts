import { db } from "@/db";
import { HttpCode } from "@/server/http-code";
import { reqError } from "@/server/req-error";
import bcrypt from "bcryptjs";
import * as EmailValidator from "email-validator";

const badReq = (msg: string) => reqError(HttpCode.BAD_REQUEST, msg);

const hashPassword = (password: string) => bcrypt.hash(password, 10);

/**
 * Validates the name
 * @param name The name to check.
 * @throws An error if the name is invalid.
 */
export const validateName = (name: string) => {
    if (name === "")
        throw badReq("Please fill in an name");
    const min = 3;
    const max = 50;
    if (name.length < min)
        throw badReq(`Your name should be at least ${min} characters long`);
    if (name.length > max)
        throw badReq(`Your name should not be longer than ${max} characters`);
};

/**
 * Validates the email
 * @param email The email to check.
 * @throws An error if the email is invalid.
 */
export const validateEmail = async (email: string) => {
    if (email === "")
        throw badReq("Please fill in an email");
    if (!EmailValidator.validate(email))
        throw badReq("Your email is invalid");
    const count = await db.user.count({ where: { email } });
    if (count > 0)
        throw badReq("This email is already taken");
};

/**
 * Validates the password
 * @param password The password to check.
 * @returns The hashed password.
 * @throws An error if the password is invalid.
 */
export const validatePassword = (password: string) => {
    const min = 8;
    const max = 200;
    if (password === "")
        throw badReq("Please fill in a password");
    if (password.length < min)
        throw badReq(`Your password should be at least ${min} characters long`);
    if (password.length > max)
        throw badReq(
            `Your password should not be longer than ${max} characters`
        );
    return hashPassword(password);
};

/**
 * Checks the credentials and returns the user id if they are valid.
 * @param email The email to check.
 * @param password The password to check.
 * @throws An error if the credentials are invalid.
 */
export const validateCreds = async (
    email: string,
    password: string,
): Promise<string> => {
    const user = await db.user.findUnique({
        select: { id: true, password: true },
        where: { email },
    });
    if (user === null)
        throw badReq("Unexisting email");
    const hash = user.password;
    const matches = await bcrypt.compare(password, hash);
    if (!matches)
        throw badReq("Wrong email or password");
    return user.id;
};
