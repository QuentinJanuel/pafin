import { db } from "@/db";
import { wrap } from "@/server/async-handler";
import { HttpCode } from "@/server/http-code";

/**
 * Creates a user.
 */
export const createUser = wrap(async (req, res) => {
    const { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
    };
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
    const { id } = req.params;
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
    const { id } = req.params;
    const { name, email } = req.body as { name: string; email: string };
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
    const { id } = req.params;
    await db.user.delete({
        where: { id },
    });
    res
        .status(HttpCode.OK)
        .json({ message: "Successfully deleted user" });
});
