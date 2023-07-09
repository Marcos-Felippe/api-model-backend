import { Project } from "../../../domain/Project";
import { ProjectRepository } from "../../../infra/repositories/projects/ProjectRepository";

interface GetProjectRequest {
    id: string;
}

type GetProjectResponse = {
    project: null;
    errorMessage: string;
} | {
    project: Project;
    errorMessage: null;
}

export class GetProjectUseCase {

    constructor(
        private projectRepository: ProjectRepository,
    ) {}

    async execute({
        id,
    }: GetProjectRequest): Promise<GetProjectResponse> {

        try {
            const project = await this.projectRepository.getProject({
                id
            });

            if(!project) {
                return {
                    project: null,
                    errorMessage: "Not Found"
                };
            }

            return {
                project,
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