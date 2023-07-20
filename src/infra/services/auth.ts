import { JwtPayload, sign, verify } from "jsonwebtoken";
import { User } from "../../domain/User";

export function signUser(user: User, secretAccess: string, secretRefresh: string,): { accessToken: string, refreshToken: string, expiresIn: number } {

    const accessToken = generateAccessToken(user.ID, secretAccess);
    const { refreshToken, expiresIn } = generateRefreshToken(user, secretRefresh);

    return {
        accessToken,
        refreshToken,
        expiresIn
    };
}

export function verifyToken(token: string, secret: string): JwtPayload {
    const decoded = verify(token, secret) as JwtPayload;
    return decoded;
}

export function generateRefreshToken(user: User, secret: string): { refreshToken: string, expiresIn: number } {

    const expiresIn = 60*60*6;

    const refreshToken = sign({
        subject: user.ID,
    }, secret, {
        expiresIn: expiresIn
    });

    

    return { refreshToken, expiresIn };
}

export function generateAccessToken(userID: string, secret: string): string {

    const expiresIn = 60*60;

    const accessToken = sign({
        subject: userID,
    }, secret, {
        expiresIn: expiresIn
    });

    return accessToken;
}