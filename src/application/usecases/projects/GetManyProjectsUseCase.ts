import { Project } from "../../../domain/Project";
import { ProjectRepository } from "../../../infra/repositories/projects/ProjectRepository";
import { UserRepository } from "../../../infra/repositories/users/UserRepository";

interface GetManyProjectsRequest {
    owner: string;
}

type GetManyProjectsResponse = {
    projects: null;
    errorMessage: string;
} | {
    projects: Project[];
    errorMessage: null;
}

export class GetManyProjectsUseCase {

    constructor(
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository
    ) {}

    async execute({
        owner,
    }: GetManyProjectsRequest): Promise<GetManyProjectsResponse> {

        try {
            // Verificando se o usuario existe no banco
            const userExists = await this.userRepository.getUser(
                owner,
            );

            if(!userExists) {
                return {
                    projects: null,
                    errorMessage: "Not Found"
                };
            }
            

            const projects = await this.projectRepository.getUserProjects(
                owner,
            );

            if(!projects) {
                return {
                    projects: null,
                    errorMessage: "Not Found"
                };
            }

            return {
                projects,
                errorMessage: null
            };
            
        } catch (error) {
            return {
                projects: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}