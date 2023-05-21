import { describe, expect, it } from "vitest";

import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";
//import { MongoUserRepository } from "../../../../infra/repositories/users/MongoUserRepository";
import { UpdateUserUseCase } from "../UpdateUserUseCase";
import { User } from "../../../../domain/User";

describe("Update User Use Case Tests", () => {
    it("should be able to update an complete user", async () => {

        const email = "emailupdated3@email.com";
        const password = "123456abc2";

        const user = new User({
            email: "emailcriadodup3@email",
            password: "123456"
        });
        await user.encrypt();

        const usersRepository = new InMemoryUserRepository();

        const userCreated = await usersRepository.create(
            user
        );

        let id = "";
        
        if(userCreated && userCreated.ID){
            id = userCreated.ID;
        }

        const updateUserUseCase = new UpdateUserUseCase(
            usersRepository
        );

        const messages = await updateUserUseCase.execute({
            id,
            email,
            password
        });
        
        expect(messages?.updateMessage).toEqual("Email and Password Updated");
        expect(messages?.errorMessage).toBeNull();
    });

    it("should be able to update user email", async () => {

        const email = "emailupdated1@email.com";

        const user = new User({
            email: "emailcriadodup1@email",
            password: "123456"
        });
        await user.encrypt();

        const usersRepository = new InMemoryUserRepository();

        const userCreated = await usersRepository.create(
            user
        );

        let id = "";
        
        if(userCreated && userCreated.ID){
            id = userCreated.ID;
        }

        const updateUserUseCase = new UpdateUserUseCase(
            usersRepository
        );

        const messages = await updateUserUseCase.execute({
            id,
            email
        });
        
        expect(messages?.updateMessage).toEqual("Email Updated");
        expect(messages?.errorMessage).toBeNull();
    });

    it("should be able to update user password", async () => {

        const password = "123456abc";

        const user = new User({
            email: "emailcriadodup2@email",
            password: "123456"
        });
        await user.encrypt();

        const usersRepository = new InMemoryUserRepository();

        const userCreated = await usersRepository.create(
            user
        );

        let id = "";
        
        if(userCreated && userCreated.ID){
            id = userCreated.ID;
        }

        const updateUserUseCase = new UpdateUserUseCase(
            usersRepository
        );

        const messages = await updateUserUseCase.execute({
            id,
            password
        });
        
        expect(messages?.updateMessage).toEqual("Password Updated");
        expect(messages?.errorMessage).toBeNull();
    });

    it("should return a not found error when try to update an user", async () => {

        const id = "1";
        const email = "emailupdated@email.com";
        const password = "123456";

        const usersRepository = new InMemoryUserRepository();
        const updateUserUseCase = new UpdateUserUseCase(
            usersRepository
        );

        const messages = await updateUserUseCase.execute({
            id,
            email,
            password
        });
        
        expect(messages?.errorMessage).toEqual("Not Found");
        expect(messages?.updateMessage).toBeNull();
    });
});