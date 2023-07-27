import { app as baseApp } from "@/server";
import { db } from "@/db";
import supertest from "supertest";
import { HttpCode } from "@/server/http-code";

const app = supertest(baseApp);

describe("the PUT /user route", () => {
    it("requires a token", async () => {
        await db.user.deleteMany();
        const res = await app.put("/user");
        expect(res.status).toBe(HttpCode.UNAUTHORIZED);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Missing authorization header");
    });
    it("requires a valid token", async () => {
        await db.user.deleteMany();
        const token = "invalid";
        const res = await app.put("/user")
            .set("Authorization", `Bearer ${token}`);
        expect(res.status).toBe(HttpCode.INTERNAL);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("jwt malformed");
    });
    it("works without any data", async () => {
        await db.user.deleteMany();
        const name = "name";
        const email = "email@mail.com";
        const password = "password";
        const res = await app.post("/user/register")
            .send({ name, email, password });
        const { token } = res.body;
        const res2 = await app.put("/user")
            .set("Authorization", `Bearer ${token}`);
        expect(res2.status).toBe(HttpCode.OK);
        expect(res2.type).toBe("application/json");
        expect(res2.body.message).toBe("Successfully updated user");
    });
    it("can update the name", async () => {
        await db.user.deleteMany();
        const name = "name";
        const email = "email@mail.com";
        const password = "password";
        const res = await app.post("/user/register")
            .send({ name, email, password });
        const { token } = res.body;
        const newName = "new name";
        const res2 = await app.put("/user")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: newName });
        expect(res2.status).toBe(HttpCode.OK);
        expect(res2.type).toBe("application/json");
        expect(res2.body.message).toBe("Successfully updated user");
        const res3 = await app.get("/user")
            .set("Authorization", `Bearer ${token}`);
        expect(res3.status).toBe(HttpCode.OK);
        expect(res3.type).toBe("application/json");
        expect(res3.body.user.name).toBe(newName);
    });
    it("can update the email", async () => {
        await db.user.deleteMany();
        const name = "name";
        const email = "email@mail.com";
        const password = "password";
        const res = await app.post("/user/register")
            .send({ name, email, password });
        const { token } = res.body;
        const newEmail = "new-email@mail.com";
        const res2 = await app.put("/user")
            .set("Authorization", `Bearer ${token}`)
            .send({ email: newEmail });
        expect(res2.status).toBe(HttpCode.OK);
        expect(res2.type).toBe("application/json");
        expect(res2.body.message).toBe("Successfully updated user");
        const res3 = await app.get("/user")
            .set("Authorization", `Bearer ${token}`);
        expect(res3.status).toBe(HttpCode.OK);
        expect(res3.type).toBe("application/json");
        expect(res3.body.user.email).toBe(newEmail);
    });
    it("can update the password", async () => {
        await db.user.deleteMany();
        const name = "name";
        const email = "email@mail.com";
        const password = "password";
        const res = await app.post("/user/register")
            .send({ name, email, password });
        const { token } = res.body;
        const newPassword = "new password";
        const res2 = await app.put("/user")
            .set("Authorization", `Bearer ${token}`)
            .send({ password: newPassword });
        expect(res2.status).toBe(HttpCode.OK);
        expect(res2.type).toBe("application/json");
        expect(res2.body.message).toBe("Successfully updated user");
        const res3 = await app.post("/user/login")
            .send({ email, password: newPassword });
        expect(res3.status).toBe(HttpCode.OK);
        expect(res3.type).toBe("application/json");
        expect(res3.body.message).toBe("Successfully logged in");
    });
});
