import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { User } from "../../../domain/User";
import mongoose from "mongoose";
import { config } from "../../database/mongo/config/database";
import { MongoUserRepository } from "./MongoUserRepository";

const uri = config.url;

const usersRepository = new MongoUserRepository();

let id_get = "";
let id_delete = "";
let id_update = "";
let id_post = "";

// Gerando uma conexão com o db e adicionando os users necessarios para alguns testes no db anteriormente
beforeAll(async () => {
    await mongoose.connect(uri).
        catch(error => console.log(error));

    // User para o teste get
    const user1 = new User({
        email: "email@mongo-repo-test-get",
        password: "123456"
    });
    user1.encrypt();

    const userCreated1 = await usersRepository.create(
        user1
    );

    // User para o teste delete
    const user2 = new User({
        email: "email@mongo-repo-test-delete",
        password: "123456"
    });
    user2.encrypt();

    const userCreated2 = await usersRepository.create(
        user2
    );

    // User para o teste update
    const user3 = new User({
        email: "email@mongo-repo-test-update",
        password: "123456"
    });
    user3.encrypt();

    const userCreated3 = await usersRepository.create(
        user3
    );


    id_get = userCreated1.ID;
    id_delete = userCreated2.ID;
    id_update = userCreated3.ID;
});

// Limpando o banco após os testes e fechando a conexão com o banco 
afterAll(async () => {
    await usersRepository.deleteUser(id_post);
    await usersRepository.deleteUser(id_get);
    await usersRepository.deleteUser(id_update);

    mongoose.connection.close();
});


describe("Mongo User Repository Create User Tests", () => {
    it("should be able to save an user", async () => {
        
        const user = new User({
            email: "email@mongo-repo-test-create",
            password: "123456"
        });
        user.encrypt();

        const userCreated = await usersRepository.create(
            user
        );

        id_post = userCreated.ID;

        expect(userCreated).toBeInstanceOf(User);
        expect(userCreated?.email).toEqual(user.email);
    });
});

describe("Mongo User Repository Get User Tests", () => {
    it("should be able to get an user", async () => {

        const user = await usersRepository.getUser(id_get);

        expect(user).toBeInstanceOf(User);
        expect(user?.email).toEqual("email@mongo-repo-test-get");
    });

    it("should not be able to get an user", async () => {

        const user = await usersRepository.getUser("1");

        expect(user).toBeNull();
    });
});

describe("Mongo User Repository Find User Tests", () => {
    it("should be able to find an user", async () => {

        const user = await usersRepository.findByEmail("email@mongo-repo-test-get");

        expect(user).toBeInstanceOf(User);
        expect(user?.email).toEqual("email@mongo-repo-test-get");
    });

    it("should not be able to find an user", async () => {

        const user = await usersRepository.getUser("1");

        expect(user).toBeNull();
    });
});

describe("Mongo User Repository Update User Tests", () => {
    it("should be able to update an user email and password", async () => {
        
        const email = "email@mongo-repo-test-update1";
        const password = "123456a";

        const updatedMessage = await usersRepository.updateUser({id: id_get, email, password});

        expect(updatedMessage).toEqual("Email and Password Updated");
    });

    it("should be able to update an user email", async () => {
        
        const email = "email@mongo-repo-test-update2";

        const updatedMessage = await usersRepository.updateUser({id: id_get, email});

        expect(updatedMessage).toEqual("Email Updated");
    });

    it("should be able to update an user password", async () => {
        
        const password = "123456b";

        const updatedMessage = await usersRepository.updateUser({id: id_get, password});

        expect(updatedMessage).toEqual("Password Updated");
    });
});

describe("Mongo User Repository Delete User Tests", () => {
    it("should be able to delete an user", async () => {
        
        const deletedMessage = await usersRepository.deleteUser(id_delete);

        expect(deletedMessage).toEqual("User Deleted");
    });
});