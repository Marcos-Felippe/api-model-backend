import { Request, Response } from "express";
import { MongoUserRepository } from "../../../../infra/repositories/users/MongoUserRepository";
import { LoginUserUseCase } from "../../../usecases/users/auth/LoginUserUseCase";

export class LoginUserController {
    async handle(request: Request, response: Response) {
        const { email, password } = request.body;

        if(!email || !password){
            return response.status(400).json("Missing Values");
        }

        const userRepository = new MongoUserRepository();
        const loginUserUseCase = new LoginUserUseCase(
            userRepository
        );

        const {accessToken, refreshToken, expiresIn, userId, errorMessage} = await loginUserUseCase.execute({
            email,
            password
        });

        if(errorMessage){
            if(errorMessage == "Not Found"){
                return response.status(404).json("Not Found");
            }

            else{
                return response.status(500).json("Internal Server Error");
            }
        }

        return response.json({
            accessToken,
            refreshToken,
            expiresIn,
            userId
        });
    }
}