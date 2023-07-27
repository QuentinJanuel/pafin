import { Router as newRouter } from "express";
import {
    createUser,
    getUser,
    updateUser,
    deleteUser,
} from "./services";

/**
 * The router for the user route.
 */
export const router = newRouter();

router.post("/", createUser);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
