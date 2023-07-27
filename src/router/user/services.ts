import { db } from "@/db";
import { wrap } from "@/server/async-handler";
import { HttpCode } from "@/server/http-code";
import {
    validateCreds,
    validateEmail,
    validateName,
    validatePassword,
} from "./utils";
import { runMaybe } from "@/utils";
import { getToken } from "@/auth";

/**
 * Registers a new user.
 */
export const register = wrap(async (req, res) => {
    const name = req.getBody("name");
    const email = req.getBody("email");
    const rawPassword = req.getBody("password");
    validateName(name);
    await validateEmail(email);
    const password = await validatePassword(rawPassword);
    const { id } = await db.user.create({
        select: { id: true },
        data: { name, email, password },
    });
    const token = getToken(id);
    res
        .status(HttpCode.CREATED)
        .json({
            message: "Successfully created user",
            id,
            token,
        });
});

/**
 * Logs in a user.
 */
export const login = wrap(async (req, res) => {
    const email = req.getBody("email");
    const password = req.getBody("password");
    const id = await validateCreds(email, password);
    const token = getToken(id);
    res
        .json({
            message: "Successfully logged in",
            id,
            token,
        });
});

/**
 * Gets a user.
 */
export const getUser = wrap(async (req, res) => {
    const id = req.getUserId();
    const user = await db.user.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
        },
        where: { id },
    });
    res.json({ user });
});

/**
 * Updates a user.
 */
export const updateUser = wrap(async (req, res) => {
    const id = req.getUserId();
    const name = req.getBodyMaybe("name");
    const email = req.getBodyMaybe("email");
    const rawPassword = req.getBodyMaybe("password");
    await runMaybe(validateName, name);
    await runMaybe(validateEmail, email);
    const password = await runMaybe(validatePassword, rawPassword);
    await db.user.update({
        data: { name, email, password },
        where: { id },
    });
    res
        .json({ message: "Successfully updated user" });
});

/**
 * Deletes a user.
 */
export const deleteUser = wrap(async (req, res) => {
    const id = req.getUserId();
    await db.user.delete({
        where: { id },
    });
    res
        .status(HttpCode.OK)
        .json({ message: "Successfully deleted user" });
});
