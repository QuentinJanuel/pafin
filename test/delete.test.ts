import { app as baseApp } from "@/server";
import { db } from "@/db";
import supertest from "supertest";
import { HttpCode } from "@/server/http-code";

const app = supertest(baseApp);

describe("the DELETE /user route", () => {
    it("requires a token", async () => {
        await db.user.deleteMany();
        const res = await app.delete("/user");
        expect(res.status).toBe(HttpCode.UNAUTHORIZED);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Missing authorization header");
    });
    it("requires a valid token", async () => {
        await db.user.deleteMany();
        const token = "invalid";
        const res = await app.delete("/user")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(HttpCode.INTERNAL);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("jwt malformed");
    });
    it("deletes the user", async () => {
        await db.user.deleteMany();
        const name = "name";
        const email = "email@mail.com";
        const password = "password";
        const res = await app.post("/user/register")
            .send({ name, email, password });
        const { id, token } = res.body;
        const res2 = await app.delete("/user")
            .set("Authorization", `Bearer ${token}`);
        expect(res2.status).toBe(HttpCode.OK);
        expect(res2.type).toBe("application/json");
        expect(res2.body.message).toBe("Successfully deleted user");
        const user = await db.user.findUnique({ where: { id } });
        expect(user).toBeNull();
    });
});
