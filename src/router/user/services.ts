import { db } from "@/db";
import { wrap } from "@/server/async-handler";
import { HttpCode } from "@/server/http-code";
import {
    validateEmail,
    validateName,
    validatePassword,
} from "./utils";
import { runMaybe } from "@/utils";

/**
 * Creates a user.
 */
export const createUser = wrap(async (req, res) => {
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
    res
        .status(HttpCode.CREATED)
        .json({
            message: "Successfully created user",
            id,
        });
});

/**
 * Gets a user.
 */
export const getUser = wrap(async (req, res) => {
    const id = req.getParam("id");
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
    const id = req.getParam("id");
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
    const id = req.getParam("id");
    await db.user.delete({
        where: { id },
    });
    res
        .status(HttpCode.OK)
        .json({ message: "Successfully deleted user" });
});
