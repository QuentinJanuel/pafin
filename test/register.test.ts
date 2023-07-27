import { app as baseApp } from "@/server";
import { db } from "@/db";
import supertest from "supertest";
import { HttpCode } from "@/server/http-code";

const app = supertest(baseApp);

describe("the register route", () => {
    it("requires a name", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/register");
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Missing body parameter: name");
    });
    it("requires an email", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/register")
            .send({ name: "name" });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Missing body parameter: email");
    });
    it("requires a password", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/register")
            .send({ name: "name", email: "email" });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Missing body parameter: password");
    });
    it("requires a valid name", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/register")
            .send({ name: "aa", email: "email", password: "password" });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error)
            .toBe("Your name should be at least 3 characters long");
        const res2 = await app.post("/user/register")
            .send({
                name: new Array(50 + 1)
                    .fill("a")
                    .join(""),
                email: "email",
                password: "password",
            });
        expect(res2.status).toBe(HttpCode.BAD_REQUEST);
        expect(res2.type).toBe("application/json");
        expect(res2.body.error)
            .toBe("Your name should not be longer than 50 characters");
    });
    it("requires a valid email", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/register")
            .send({ name: "name", email: "email", password: "password" });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("Your email is invalid");
    });
    it("requires a unique email", async () => {
        await db.user.deleteMany();
        const email = "email@mail.com";
        await db.user.create({
            data: {
                name: "name",
                email,
                password: "password",
            },
        });
        const res = await app.post("/user/register")
            .send({
                name: "name",
                email,
                password: "password",
            });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error).toBe("This email is already taken");
    });
    it("requires a valid password", async () => {
        await db.user.deleteMany();
        const res = await app.post("/user/register")
            .send({
                name: "name",
                email: "email@mail.com",
                password: "1234567",
            });
        expect(res.status).toBe(HttpCode.BAD_REQUEST);
        expect(res.type).toBe("application/json");
        expect(res.body.error)
            .toBe("Your password should be at least 8 characters long");
        const res2 = await app.post("/user/register")
            .send({
                name: "name",
                email: "email@mail.com",
                password: new Array(200 + 1)
                    .fill("a")
                    .join(""),
            });
        expect(res2.status).toBe(HttpCode.BAD_REQUEST);
        expect(res2.type).toBe("application/json");
        expect(res2.body.error)
            .toBe("Your password should not be longer than 200 characters");
    });
    it("registers a user", async () => {
        await db.user.deleteMany();
        const name = "name";
        const email = "email@mail.com";
        const password = "password";
        const res = await app.post("/user/register")
            .send({ name, email, password });
        expect(res.status).toBe(HttpCode.CREATED);
        expect(res.type).toBe("application/json");
        expect(res.body.message).toBe("Successfully created user");
        expect(res.body.id).toBeDefined();
        expect(res.body.token).toBeDefined();
        const user = await db.user.findUnique({
            select: { id: true, name: true, email: true, password: true },
            where: { id: res.body.id },
        });
        expect(user).toBeDefined();
        expect(user!.name).toBe(name);
        expect(user!.email).toBe(email);
        expect(user!.password).not.toBe(password);
    });
});
