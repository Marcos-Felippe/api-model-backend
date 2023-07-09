import { Request, Response } from "express";
import { MongoProjectRepository } from "../../../infra/repositories/projects/MongoProjectRepository";
import { UpdateProjectUseCase } from "../../usecases/projects/UpdateProjectUseCase";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";

export class UpdateProjectController {
    async handle(request: Request, response: Response) {
        const { id, owner } = request.params;

        const { title, description } = request.body;

        if(!id || !owner){
            return response.status(400).json("Missing Values");
        }

        if(!title && !description){
            return response.status(400).json("Missing Values");
        }

        const projectRepository = new MongoProjectRepository();
        const userRepository = new MongoUserRepository();

        const updateProjectUseCase = new UpdateProjectUseCase(
            projectRepository,
            userRepository
        );

        const {updateMessage, errorMessage} = await updateProjectUseCase.execute({
            id,
            title,
            description,
            owner
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