import { compare, hash } from "bcryptjs";

export async function passwordHash(password: string): Promise<string> {
    return await hash(password, 8);
}

export async function comparePassword(requestPassword: string, userPassword: string): Promise<boolean> {
    const passwordMatch = await compare(requestPassword, userPassword);
    return passwordMatch;
}