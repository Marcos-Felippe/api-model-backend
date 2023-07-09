import { ProjectRepository } from "../../../infra/repositories/projects/ProjectRepository";
import { UserRepository } from "../../../infra/repositories/users/UserRepository";

type DeleteUserResponse = {
    deletedMessage: string | null
    errorMessage: string | null
}

export class DeleteUserUseCase {

    constructor(
        private userRepository: UserRepository,
        private projectRepository: ProjectRepository
    ) {}

    async execute(id: string): Promise<DeleteUserResponse> {

        try {
            const user = await this.userRepository.getUser(
                id,
            );

            if(!user) {
                return {
                    deletedMessage: null,
                    errorMessage: "Not Found",
                };
            }

            const deletedProjectMessage = await this.projectRepository.deleteUserProjects(id);

            if(!deletedProjectMessage) {
                return {
                    deletedMessage: null,
                    errorMessage: "Internal Server Error",
                };
            }

            const deletedUserMessage = await this.userRepository.deleteUser(id);

            return {
                deletedMessage: deletedUserMessage,
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