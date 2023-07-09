import { Request, Response } from "express";
import { MongoProjectRepository } from "../../../infra/repositories/projects/MongoProjectRepository";
import { GetProjectUseCase } from "../../usecases/projects/GetProjectUseCase";

export class GetProjectController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        if(!id){
            return response.status(400).json("Missing Values");
        }

        const projectRepository = new MongoProjectRepository();
        const getProjectUseCase = new GetProjectUseCase(
            projectRepository
        );

        const {project, errorMessage} = await getProjectUseCase.execute({
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
            project: {
                id: project?.id,
                title: project?.title,
                description: project?.description,
                owner: project?.owner
            }
        });
    }
}