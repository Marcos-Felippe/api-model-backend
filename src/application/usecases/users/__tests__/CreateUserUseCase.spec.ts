import { describe, expect, it } from "vitest";

import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";
//import { MongoUserRepository } from "../../../../infra/repositories/users/MongoUserRepository";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { User } from "../../../../domain/User";

describe("Create User Use Case Tests", () => {
    it("should be able to create an user", async () => {
        
        const email = "emailcriado2@email.com";
        const password = "123456";

        const usersRepository = new InMemoryUserRepository();
        const createUserUseCase = new CreateUserUseCase(
            usersRepository
        );

        const {user, errorMessage} = await createUserUseCase.execute({email, password});

        expect(user).toBeInstanceOf(User);
        expect(user?.email).toEqual(email);
        expect(errorMessage).toBeNull();
    });

    it("should return an user already exists error when try to create an user", async () => {
        
        const email1 = "emailcriado3@email.com";
        const password1 = "123456";

        const email2 = "emailcriado3@email.com";
        const password2 = "123456";

        const usersRepository = new InMemoryUserRepository();
        const createUserUseCase = new CreateUserUseCase(
            usersRepository
        );

        const {user: user1, errorMessage: message1} = await createUserUseCase.execute({email: email1, password: password1});
        const {user: user2, errorMessage: message2} = await createUserUseCase.execute({email: email2, password: password2});

        expect(user1).toBeInstanceOf(User);
        expect(user1?.email).toEqual(email1);
        expect(message1).toBeNull();

        expect(message2).toEqual("User Already Exists");
        expect(user2).toBeNull();
    });
});