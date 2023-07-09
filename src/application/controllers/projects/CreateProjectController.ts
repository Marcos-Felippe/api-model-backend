import { Request, Response } from "express";
import { CreateProjectUseCase } from "../../usecases/projects/CreateProjectUseCase";
import { MongoProjectRepository } from "../../../infra/repositories/projects/MongoProjectRepository";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";

export class CreateProjectController {
    async handle(request: Request, response: Response) {
        const { owner } = request.params;
        const { title, description } = request.body;

        if(!title || !description){
            return response.status(400).json("Missing Values");
        }

        const projectRepository = new MongoProjectRepository();
        const userRepository = new MongoUserRepository();

        const createProjectUseCase = new CreateProjectUseCase(
            projectRepository,
            userRepository
        );

        const {project, errorMessage} = await createProjectUseCase.execute({
            title,
            description,
            owner
        });

        // Retornando os erros do usecase se houverem
        if(errorMessage){
            if(errorMessage == "Project Already Exists"){
                return response.status(422).json("Project Already Exists");
            }

            else{
                return response.status(500).json("Internal Server Error");
            }
        }

        // Retorno caso não ocorram erros
        return response.status(201).json({
            project: {
                id: project?.id,
                title: project?.title,
                description: project?.description,
                owner: project?.owner
            }
        });
    }
}