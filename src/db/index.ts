import { PrismaClient } from "@prisma/client";

/**
 * The database client.
 */
export const db = new PrismaClient();
