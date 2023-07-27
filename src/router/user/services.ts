import { db } from "@/db";
import { wrap } from "@/server/async-handler";
import { HttpCode } from "@/server/http-code";

/**
 * Creates a user.
 */
export const createUser = wrap(async (req, res) => {
    const name = req.getBody("name");
    const email = req.getBody("email");
    const password = req.getBody("password");
    await db.user.create({
        data: { name, email, password },
    });
    res
        .status(HttpCode.CREATED)
        .json({ message: "Successfully created user" });
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
    await db.user.update({
        data: { name, email },
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
