import { ProjectRepository, UpdateProjectDTO } from "../../../infra/repositories/projects/ProjectRepository";
import { UserRepository } from "../../../infra/repositories/users/UserRepository";

export class UpdateProjectUseCase {

    constructor(
        private projectRepository: ProjectRepository,
        private userRepository: UserRepository
    ) {}

    async execute({
        id,
        title,
        description,
        owner
    }: UpdateProjectDTO): Promise<{
        updateMessage: null;
        errorMessage: string;
    } | {
        updateMessage: string;
        errorMessage: null;
    }> {

        try {
            // Verificando se o usuario existe no banco
            const userExists = await this.userRepository.getUser(
                owner,
            );

            if(!userExists) {
                return {
                    updateMessage: null,
                    errorMessage: "Not Found"
                };
            }


            const project = await this.projectRepository.getProject({
                id,
            });

            if(!project) {
                return {
                    updateMessage: null,
                    errorMessage: "Not Found"
                };
            }
            
            const updatedProjectMessage = await this.projectRepository.updateProject({id, title, description, owner});

            return {
                updateMessage: updatedProjectMessage,
                errorMessage: null
            };
            
        } catch (error) {
            return {
                updateMessage: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}