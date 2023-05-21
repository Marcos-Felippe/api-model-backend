import { Request, Response } from "express";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";
import { GetUserUseCase } from "../../usecases/users/GetUserUseCase";

export class GetUserController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        if(!id){
            return response.status(400).json("Missing Values");
        }

        const userRepository = new MongoUserRepository();
        const getUserUseCase = new GetUserUseCase(
            userRepository
        );

        const {user, errorMessage} = await getUserUseCase.execute({
            id
        });

        // Retornando os erros do usecase se houverem
        if(errorMessage){
            if(errorMessage == "Not Found"){
                return response.status(404).json("Not Found");
            }

            else{
                return response.status(500).json("Internal Server Error");
            }
        }

        // Retorno caso não ocorram erros
        return response.status(200).json({
            user: {
                id: user?.ID,
                email: user?.email
            }
        });
    }
}