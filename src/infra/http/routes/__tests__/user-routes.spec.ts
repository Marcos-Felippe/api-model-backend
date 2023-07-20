import app from "../../app";
import request from "supertest";
import { describe, expect } from "@jest/globals";
import mongoose from "../../../database/mongo/config";

let token = "";
let id_get = "";
let id_delete = "";
let id_update = "";
let id_post = "";

// Adicionando os users necessarios para alguns testes no db anteriormente e gerando um token
beforeAll(async () => {

    // User para o teste get
    const res1 = await request(app)
        .post("/user")
        .send({
            email: "email@rota-get",
            password: "123456"
        });

    // Fazendo um login para gerar um token
    const resToken = await request(app)
        .post("/login")
        .send({
            email: "email@rota-get",
            password: "123456"
        });

    // User para o teste delete
    const res2 = await request(app)
        .post("/user")
        .send({
            email: "email@rota-delete",
            password: "123456"
        });

    // User para o teste update
    const res3 = await request(app)
        .post("/user")
        .send({
            email: "email@rota-update",
            password: "123456"
        });

    id_get = res1.body.user.id;
    id_delete = res2.body.user.id;
    id_update = res3.body.user.id;
    token = resToken.body.accessToken;
});

// Limpando o db após os testes e fechando a conexão com o banco 
afterAll(async () => {
    await request(app)
        .delete(`/user/${id_get}`)
        .set("Authorization", `Bearer ${token}`);

    await request(app)
        .delete(`/user/${id_update}`)
        .set("Authorization", `Bearer ${token}`);

    await request(app)
        .delete(`/user/${id_post}`)
        .set("Authorization", `Bearer ${token}`);

    mongoose.connection.close();
});


describe("POST /user Tests", () => {
    it("should return status code 201 when try to create an user", async () => {
        const res = await request(app)
            .post("/user")
            .send({
                email: "email@rota-create",
                password: "123456"
            });

        id_post = res.body.user.id;
      
        expect(res.statusCode).toEqual(201);
        expect(res.body.user.email).toEqual("email@rota-create");
    });

    it("should return status code 422 when try to create an user that already exists", async () => {
        const res = await request(app)
            .post("/user")
            .send({
                email: "email@rota-create",
                password: "123456"
            });
        
        expect(res.statusCode).toEqual(422);
    });

    it("should return status code 400 when try to create an user with missing values", async () => {
        const res = await request(app).post("/user").send();
        expect(res.statusCode).toEqual(400);
    });
});

describe("GET /user Tests", () => {
    it("should return status code 200 when try to get an user", async () => {
        const res = await request(app)
            .get(`/user/${id_get}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            user: {
                id: id_get,
                email: "email@rota-get"
            }
        });
    });

    it("should return status code 404 when try to get an invalid user", async () => {
        const res = await request(app)
            .get("/user/1")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it("should return status code 401 when try to get an user without auth", async () => {
        const res = await request(app)
            .get("/user/12345");
        
        expect(res.statusCode).toEqual(401);
    });
});

describe("DELETE /user Tests", () => {
    it("should return status code 200 when try to delete an user", async () => {
        const res = await request(app)
            .delete(`/user/${id_delete}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.deletedMessage).toEqual("User Deleted");
    });

    it("should return status code 404 when try to delete an invalid user", async () => {
        const res = await request(app)
            .delete("/user/1")
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it("should return status code 401 when try to delete an user without auth", async () => {
        const res = await request(app)
            .delete("/user/1");
        
        expect(res.statusCode).toEqual(401);
    });
});

describe("UPDATE /user Tests", () => {
    it("should return status code 201 when try to update email and password", async () => {
        const res = await request(app)
            .patch(`/user/${id_update}`)
            .send({
                email: "email@rota-update2",
                password: "123456a"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Email and Password Updated");
    });

    it("should return status code 201 when try to update email", async () => {
        const res = await request(app)
            .patch(`/user/${id_update}`)
            .send({
                email: "email@rota-update3"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Email Updated");
    });

    it("should return status code 201 when try to update password", async () => {
        const res = await request(app)
            .patch(`/user/${id_update}`)
            .send({
                password: "123456b"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Password Updated");
    });

    it("should return status code 400 when try to update email and password empty", async () => {
        const res = await request(app)
            .patch(`/user/${id_update}`)
            .send()
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(400);
    });

    it("should return status code 404 when try to update an invalid user", async () => {
        const res = await request(app)
            .patch("/user/1")
            .send({
                email: "email@rota-update4",
                password: "123456d"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it("should return status code 401 when try to update an user without auth", async () => {
        const res = await request(app)
            .patch("/user/1")
            .send({
                email: "email@rota-update5",
                password: "123456e"
            });
        
        expect(res.statusCode).toEqual(401);
    });
});
