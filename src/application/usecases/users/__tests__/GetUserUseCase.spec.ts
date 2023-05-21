import { describe, expect, it } from "vitest";

import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";
//import { MongoUserRepository } from "../../../../infra/repositories/users/MongoUserRepository";
import { GetUserUseCase } from "../GetUserUseCase";
import { User } from "../../../../domain/User";

describe("Get User Use Case Tests", () => {
    it("should be able to get an user", async () => {

        const id = "12345-abc";

        const usersRepository = new InMemoryUserRepository();
        const getUserUseCase = new GetUserUseCase(
            usersRepository
        );

        const { user, errorMessage } = await getUserUseCase.execute({ id });

        expect(user).toBeInstanceOf(User);
        expect(user?.email).toEqual("emailteste@email.com");
        expect(errorMessage).toBeNull();
    });

    it("should return a not found error when try to get an user", async () => {
        
        const id = "1";

        const usersRepository = new InMemoryUserRepository();
        const getUserUseCase = new GetUserUseCase(
            usersRepository
        );

        const { user, errorMessage } = await getUserUseCase.execute({ id });

        expect(user).toBeNull();
        expect(errorMessage).toEqual("Not Found");
    });
});