import { describe, expect, it } from "vitest";

import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";
//import { MongoUserRepository } from "../../../../infra/repositories/users/MongoUserRepository";
import { DeleteUserUseCase } from "../DeleteUserUseCase";
import { User } from "../../../../domain/User";

describe("Delete User Use Case Tests", () => {
    it("should be able to delete an user", async () => {

        const user = new User({
            email: "emailcriadodel@email",
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

        const deleteUserUseCase = new DeleteUserUseCase(
            usersRepository
        );

        const { deletedMessage, errorMessage } = await deleteUserUseCase.execute(id);

        expect(deletedMessage).toEqual("User Deleted");
        expect(errorMessage).toBeNull();
    });

    it("should return a not found error when try to delete an user", async () => {
        
        const id = "1";

        const usersRepository = new InMemoryUserRepository();
        const deleteUserUseCase = new DeleteUserUseCase(
            usersRepository
        );

        const { deletedMessage, errorMessage } = await deleteUserUseCase.execute(id);

        expect(errorMessage).toEqual("Not Found");
        expect(deletedMessage).toBeNull();
    });
});