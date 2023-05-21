import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../services/auth";

export async function authentication(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;
    const secret = process.env.JWT_SECRET;

    if(!secret){
        return response.status(401).end();
    }

    if (!authHeader) {
        return response.status(401).end();
    }

    const [, token] = authHeader.split(" ");

    try {
        const decoded = verifyToken(token, secret);

        const { subject: userId } = decoded;

        request.userId = String(userId);

        return next();
    } catch (err) {
        return response.status(401).end();
    }
}