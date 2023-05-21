import { Request, Response } from "express";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";
import { UpdateUserUseCase } from "../../usecases/users/UpdateUserUseCase";

export class UpdateUserController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        const { email, password } = request.body;

        if(!id){
            return response.status(400).json("Missing Values");
        }

        if(!email && !password){
            return response.status(400).json("Missing Values");
        }

        const userRepository = new MongoUserRepository();
        const updateUserUseCase = new UpdateUserUseCase(
            userRepository
        );

        const {updateMessage, errorMessage} = await updateUserUseCase.execute({
            id,
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

        return response.status(201).json({
            message: updateMessage
        });
    }
}