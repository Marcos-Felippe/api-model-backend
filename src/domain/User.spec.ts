import { describe, expect, it } from "vitest";
import { User } from "./User";
import { compare } from "bcryptjs";

describe("Create User Tests", () => {
    it("should be able to create an user", async () => {
        
        const email = "email@email";
        const password = "123456";

        const user = new User({
            email,
            password
        });
        await user.encrypt();

        const passwordMatch = await compare(password, user.password);

        expect(user.ID).is;
        expect(user).toBeInstanceOf(User);
        expect(user.email).toEqual(email);
        expect(passwordMatch).toEqual(true);
    });

    it("should return an invalid email error when try to create an user", async () => {
        
        const email = "";
        const password = "123456";

        expect(() => {
            return new User({
                email,
                password
            });
        }).toThrow();
    });

    it("should return an invalid password error when try to create an user", async () => {
        
        const email = "email@email";
        const password = "";

        expect(() => {
            return new User({
                email,
                password
            });
        }).toThrow();
    });
});