import { Router as newRouter } from "express";
import {
    register,
    login,
    getUser,
    updateUser,
    deleteUser,
} from "./services";
import { auth } from "@/auth";

/**
 * The router for the user route.
 */
export const router = newRouter();

router.post("/register", register);
router.post("/login", login);
router.get("/", auth, getUser);
router.put("/", auth, updateUser);
router.delete("/", auth, deleteUser);
