import { Request, Response } from "express";
import { MongoProjectRepository } from "../../../infra/repositories/projects/MongoProjectRepository";
import { DeleteProjectUseCase } from "../../usecases/projects/DeleteProjectUseCase";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";

export class DeleteProjectController {
    async handle(request: Request, response: Response) {
        const { id, owner } = request.params;

        if(!id){
            return response.status(400).json("Missing Values");
        }

        if(!owner){
            return response.status(400).json("Missing Values");
        }

        const projectRepository = new MongoProjectRepository();
        const userRepository = new MongoUserRepository();

        const deleteProjectUseCase = new DeleteProjectUseCase(
            projectRepository,
            userRepository
        );

        const { deletedMessage, errorMessage } = await deleteProjectUseCase.execute({id, owner});

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