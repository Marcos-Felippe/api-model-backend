import { describe, expect, beforeAll, afterAll, test } from "vitest";
import { MongoUserRepository } from "../../../../infra/repositories/users/MongoUserRepository";
import { LoginUserUseCase } from "../auth/LoginUserUseCase";
import mongoose from "mongoose";
import { config } from "../../../../infra/database/mongo/config/database";
import { User } from "../../../../domain/User";

const usersRepository = new MongoUserRepository();

const uri = config.url;

const email = "emaillogin@email.com";
const password = "123456";
let id = null;

beforeAll(async () => {

    await mongoose.connect(uri).
        catch(error => console.log(error));
    
    const user = new User({
        email,
        password
    });
    await user.encrypt();

    const userCreated = await usersRepository.create(
        user
    );

    id = userCreated?.ID;
});

afterAll(async () => {
    await usersRepository.deleteUser(id);

    mongoose.connection.close();
});

describe("Login User Use Case Tests", () => {
    test.runIf(id == null || id == undefined)("should be able to login an user", async () => {
        const loginUserUseCase = new LoginUserUseCase(
            usersRepository
        );

        const {accessToken, refreshToken, expiresIn, userId, errorMessage} = await loginUserUseCase.execute({
            email,
            password
        });

        expect(accessToken).is;
        expect(refreshToken).is;
        expect(expiresIn).toEqual(21600);
        expect(userId).toEqual(id);
        expect(errorMessage).toBeNull();
    });


    test.runIf(id == null || id == undefined)("should not be able to login an user with wrong password", async () => {
        const loginUserUseCase = new LoginUserUseCase(
            usersRepository
        );

        const {accessToken, refreshToken, expiresIn, userId, errorMessage} = await loginUserUseCase.execute({
            email,
            password: "19686"
        });

        expect(accessToken).toBeNull;
        expect(refreshToken).toBeNull;
        expect(expiresIn).toBeNull;
        expect(userId).toBeNull;
        expect(errorMessage).equal("Not Found");
    });
});