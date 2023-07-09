import { Project } from "../../../domain/Project";
import { ProjectRepository } from "../../../infra/repositories/projects/ProjectRepository";
import { UserRepository } from "../../../infra/repositories/users/UserRepository";

interface CreateProjectRequest {
    title: string
    description: string
    owner: string
}

export class CreateProjectUseCase {

    constructor(
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository
    ) {}

    async execute({
        title,
        description,
        owner
    }: CreateProjectRequest): Promise<{
        project: null;
        errorMessage: string;
    } | {
        project: Project;
        errorMessage: null;
    }> {

        try {
            // Verificando se o usuario existe no banco
            const userExists = await this.userRepository.getUser(
                owner,
            );

            if(!userExists) {
                return {
                    project: null,
                    errorMessage: "Not Found"
                };
            }

            // Verificando se o projeto já existe no banco
            const projectExists = await this.projectRepository.getProject({
                title,
                owner
            });

            if(projectExists) {
                return {
                    project: null,
                    errorMessage: "Project Already Exists"
                };
            }


            const project = new Project({
                title,
                description,
                owner
            });

            await this.projectRepository.create(project);

            return {
                project: project,
                errorMessage: null
            };

        } catch (error) {
            return {
                project: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}