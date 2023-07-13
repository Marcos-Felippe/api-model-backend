import { Request, Response } from "express";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";
import { DeleteUserUseCase } from "../../usecases/users/DeleteUserUseCase";
import { MongoProjectRepository } from "../../../infra/repositories/projects/MongoProjectRepository";

export class DeleteUserController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        if(!id){
            return response.status(400).json("Missing Values");
        }

        const userRepository = new MongoUserRepository();
        const projectsRepository = new MongoProjectRepository();

        const deleteUserUseCase = new DeleteUserUseCase(
            userRepository,
            projectsRepository
        );

        const { deletedMessage, errorMessage } = await deleteUserUseCase.execute(id);

        if(errorMessage){
            if(errorMessage == "Not Found"){
                return response.status(404).json("Not Found");
            }

            else{
                return response.status(500).json("Internal Server Error");
            }
        }

        return response.status(200).json({
            deletedMessage
        });
    }
}