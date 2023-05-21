import { describe, expect, it } from "vitest";
import { User } from "../../../../domain/User";
import { InMemoryUserRepository } from "./InMemoryUserRepository";

describe("In Memory Create User Tests", () => {
    it("should be able to save an user", async () => {
        
        const user = new User({
            email: "emailcriado1@email",
            password: "123456"
        });
        await user.encrypt();

        const usersRepository = new InMemoryUserRepository();

        const userCreated = await usersRepository.create(
            user
        );

        expect(userCreated).toBeInstanceOf(User);
        expect(userCreated?.email).toEqual(user.email);
    });
});

describe("In Memory Get User Tests", () => {
    it("should be able to get an user", async () => {
        
        const id = "12345-abc";

        const usersRepository = new InMemoryUserRepository();

        const user = await usersRepository.getUser(
            id
        );

        expect(user).toBeInstanceOf(User);
        expect(user?.email).toEqual("emailteste@email.com");
    });

    it("should not be able to get an user", async () => {
        
        const id = "1";

        const usersRepository = new InMemoryUserRepository();

        const user = await usersRepository.getUser(
            id
        );

        expect(user).toBeNull;
    });
});

describe("In Memory Update User Tests", () => {
    it("should be able to update an user email", async () => {

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

        const message = await usersRepository.updateUser({id, email});
        
        expect(message).toEqual("Email Updated");
    });

    it("should be able to update an user password", async () => {
        
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

        const message = await usersRepository.updateUser({id, password});
        
        expect(message).toEqual("Password Updated");
    });

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

        const message = await usersRepository.updateUser({id, email, password});
        
        expect(message).toEqual("Email and Password Updated");
    });
});

describe("In Memory Delete User Tests", () => {
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

        const deletedMessage = await usersRepository.deleteUser(
            id
        );

        expect(deletedMessage).toEqual("User Deleted");
    });

    it("should not be able to delete an user", async () => {
        
        const id = "1";

        const usersRepository = new InMemoryUserRepository();

        const deletedMessage = await usersRepository.deleteUser(
            id
        );

        expect(deletedMessage).toEqual("Not Found");
    });
});