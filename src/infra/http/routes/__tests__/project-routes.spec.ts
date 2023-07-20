import app from "../../app";
import request from "supertest";
import { describe, expect } from "@jest/globals";
import mongoose from "../../../database/mongo/config";

let token = "";
let id_user = "";
let id_get = "";
let id_delete = "";
let id_update = "";
let id_post = "";

// Adicionando os users e projects necessarios para alguns testes no db anteriormente e gerando um token
beforeAll(async () => {

    // User para os testes
    const user1 = await request(app)
        .post("/user")
        .send({
            email: "email@rota-projects",
            password: "123456"
        });

    id_user = user1.body.user.id;
    
    // Fazendo um login para gerar um token
    const resToken = await request(app)
        .post("/login")
        .send({
            email: "email@rota-projects",
            password: "123456"
        });

    token = resToken.body.accessToken;


    // Project para o teste get
    const res1 = await request(app)
        .post(`/user/${id_user}/project`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "titulo rota-get",
            description: "description rota-get"
        });

    // Project para o teste update
    const res2 = await request(app)
        .post(`/user/${id_user}/project`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "titulo rota-update",
            description: "description rota-update"
        });

    // Project para o teste delete
    const res3 = await request(app)
        .post(`/user/${id_user}/project`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "titulo rota-delete",
            description: "description rota-delete"
        });


    id_get = res1.body.project.id;
    id_update = res2.body.project.id;
    id_delete = res3.body.project.id;
});

// Limpando o db após os testes e fechando a conexão com o banco 
afterAll(async () => {
    await request(app)
        .delete(`/user/${id_user}/project/${id_update}`)
        .set("Authorization", `Bearer ${token}`);

    await request(app)
        .delete(`/user/${id_user}/project/${id_post}`)
        .set("Authorization", `Bearer ${token}`);

    await request(app)
        .delete(`/user/${id_user}/project/${id_get}`)
        .set("Authorization", `Bearer ${token}`);

    await request(app)
        .delete(`/user/${id_user}`)
        .set("Authorization", `Bearer ${token}`);

    mongoose.connection.close();
});


describe("POST /project Tests", () => {
    it("should return status code 201 when try to create a project", async () => {
        const res = await request(app)
            .post(`/user/${id_user}/project`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "titulo rota-create",
                description: "description rota-create"
            });

        id_post = res.body.project.id;
      
        expect(res.statusCode).toEqual(201);
        expect(res.body.project.title).toEqual("titulo rota-create");
        expect(res.body.project.description).toEqual("description rota-create");
        expect(res.body.project.owner).toEqual(id_user);
    });

    it("should return status code 422 when try to create a project that already exists", async () => {
        const res = await request(app)
            .post(`/user/${id_user}/project`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "titulo rota-create",
                description: "description rota-create"
            });
        
        expect(res.statusCode).toEqual(422);
    });

    it("should return status code 400 when try to create a project with missing values", async () => {
        const res = await request(app).post(`/user/${id_user}/project`)
            .set("Authorization", `Bearer ${token}`).send();
        expect(res.statusCode).toEqual(400);
    });
});

describe("GET /project Tests", () => {
    it("should return status code 200 when try to get a project", async () => {
        const res = await request(app)
            .get(`/user/${id_user}/project/${id_get}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            project: {
                id: id_get,
                title: "titulo rota-get",
                description: "description rota-get",
                owner: id_user
            }
        });
    });

    it("should return status code 404 when try to get an invalid project", async () => {
        const res = await request(app)
            .get(`/user/${id_user}/project/1941526`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it("should return status code 401 when try to get a project without auth", async () => {
        const res = await request(app)
            .get(`/user/${id_user}/project/${id_get}`);
        
        expect(res.statusCode).toEqual(401);
    });
});

describe("DELETE /project Tests", () => {
    it("should return status code 200 when try to delete a project", async () => {
        const res = await request(app)
            .delete(`/user/${id_user}/project/${id_delete}`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.deletedMessage).toEqual("Project Deleted");
    });

    it("should return status code 404 when try to delete an invalid project", async () => {
        const res = await request(app)
            .delete(`/user/${id_user}/project/195295`)
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it("should return status code 401 when try to delete a project without auth", async () => {
        const res = await request(app)
            .delete(`/user/${id_user}/project/${id_delete}`);
        
        expect(res.statusCode).toEqual(401);
    });
});

describe("UPDATE /project Tests", () => {
    it("should return status code 201 when try to update title and description", async () => {
        const res = await request(app)
            .patch(`/user/${id_user}/project/${id_update}`)
            .send({
                title: "titulo rota-update new1",
                description: "description rota-update new1"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Title and Description Updated");
    });

    it("should return status code 201 when try to update title", async () => {
        const res = await request(app)
            .patch(`/user/${id_user}/project/${id_update}`)
            .send({
                title: "titulo rota-update new2"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Title Updated");
    });

    it("should return status code 201 when try to update description", async () => {
        const res = await request(app)
            .patch(`/user/${id_user}/project/${id_update}`)
            .send({
                description: "description rota-update new"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual("Description Updated");
    });

    it("should return status code 400 when try to update title and description empty", async () => {
        const res = await request(app)
            .patch(`/user/${id_user}/project/${id_update}`)
            .send()
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(400);
    });

    it("should return status code 404 when try to update an invalid project", async () => {
        const res = await request(app)
            .patch(`/user/${id_user}/project/5195195`)
            .send({
                title: "titulo rota-update new",
                description: "description rota-update new"
            })
            .set("Authorization", `Bearer ${token}`);
        
        expect(res.statusCode).toEqual(404);
    });

    it("should return status code 401 when try to update a project without auth", async () => {
        const res = await request(app)
            .patch(`/user/${id_user}/project/${id_update}`)
            .send({
                title: "titulo rota-update new",
                description: "description rota-update new"
            });
        
        expect(res.statusCode).toEqual(401);
    });
});