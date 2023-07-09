import { Request, Response } from "express";
import { MongoProjectRepository } from "../../../infra/repositories/projects/MongoProjectRepository";
import { GetManyProjectsUseCase } from "../../usecases/projects/GetManyProjectsUseCase";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";

export class GetManyProjectsController {
    async handle(request: Request, response: Response) {
        const { owner } = request.params;

        if(!owner){
            return response.status(400).json("Missing Values");
        }

        const projectRepository = new MongoProjectRepository();
        const userRepository = new MongoUserRepository();
        
        const getManyProjectsUseCase = new GetManyProjectsUseCase(
            projectRepository,
            userRepository
        );

        const {projects, errorMessage} = await getManyProjectsUseCase.execute({
            owner
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
            projects
        });
    }
}