import { app as baseApp } from "@/server";
import { db } from "@/db";
import supertest from "supertest";
import { HttpCode } from "@/server/http-code";

const app = supertest(baseApp);

describe("the login route", () => {
    it("requires an email", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/login");
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Missing body parameter: email");
    });
    it("requires a password", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/login")
            .send({ email: "email" });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Missing body parameter: password");
    });
    it("requires an existing email", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/login")
            .send({ email: "email", password: "password" });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Unexisting email");
    });
    it("requires a valid password", async () => {
        await db.user.deleteMany();
        const email = "email@mail.com";
        await app.post("/user/register")
            .send({ name: "name", email, password: "password" });
        const res = await app.post("/user/login")
            .send({ email, password: "wrong" });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Wrong email or password");
    });
    it("logs in a user", async () => {
        await db.user.deleteMany();
        const email = "email@mail.com";
        const password = "password";
        await app.post("/user/register")
            .send({ name: "name", email, password });
        const res = await app.post("/user/login")
            .send({ email, password });
        expect(res.status).toBe(HttpCode.OK);
        expect(res.type).toBe("application/json");
        expect(res.body.message).toBe("Successfully logged in");
        expect(res.body.id).toBeDefined();
        expect(res.body.token).toBeDefined();
        const user = await db.user.findUnique({
            select: { id: true, email: true, password: true },
            where: { id: res.body.id },
        });
        expect(user).toBeDefined();
        expect(user!.id).toBe(res.body.id);
        expect(user!.email).toBe(email);
        expect(user!.password).not.toBe(password);
    });
});
