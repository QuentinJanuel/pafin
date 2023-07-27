import { Router as newRouter } from "express";

import { router as userRouter } from "./user";

export const router = newRouter();

router.use("/user", userRouter);
