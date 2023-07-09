import { ProjectRepository } from "../../../infra/repositories/projects/ProjectRepository";
import { UserRepository } from "../../../infra/repositories/users/UserRepository";

interface DeleteProjectRequest {
    id: string;
    owner: string;
}

type DeleteProjectResponse = {
    deletedMessage: string | null
    errorMessage: string | null
}

export class DeleteProjectUseCase {

    constructor(
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository
    ) {}

    async execute({ id, owner }: DeleteProjectRequest): Promise<DeleteProjectResponse> {

        try {
            // Verificando se o usuario existe no banco
            const userExists = await this.userRepository.getUser(
                owner,
            );

            if(!userExists) {
                return {
                    deletedMessage: null,
                    errorMessage: "Not Found"
                };
            }

            const project = await this.projectRepository.getProject({
                id,
            });

            if(!project) {
                return {
                    deletedMessage: null,
                    errorMessage: "Not Found",
                };
            }

            const deletedMessage = await this.projectRepository.deleteProject(id, owner);

            return {
                deletedMessage,
                errorMessage: null,
            };

        } catch (error) {
            return {
                deletedMessage: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}