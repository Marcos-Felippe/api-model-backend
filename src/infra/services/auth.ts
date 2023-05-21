import { JwtPayload, sign, verify } from "jsonwebtoken";
import { User } from "../../domain/User";

export function signUser(user: User, secret: string): string {
    const token = sign({
        subject: user.ID,
    }, secret);
    return token;
}

export function verifyToken(token: string, secret: string): JwtPayload {
    const decoded = verify(token, secret) as JwtPayload;
    return decoded;
}