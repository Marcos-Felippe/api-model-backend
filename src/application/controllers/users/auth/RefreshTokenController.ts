import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../usecases/users/auth/RefreshTokenUseCase";

export class RefreshTokenController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;
        const { refreshToken } = request.body;

        if(!refreshToken || !id){
            return response.status(400).json("Missing Values");
        }

        const refreshTokenUseCase = new RefreshTokenUseCase();

        const {accessToken, userId, errorMessage} = await refreshTokenUseCase.execute({
            id,
            refreshToken
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
            userId
        });
    }
}