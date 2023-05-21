import { UserRepository } from "../../../infra/repositories/users/UserRepository";

type DeleteUserResponse = {
    deletedMessage: string | null
    errorMessage: string | null
}

export class DeleteUserUseCase {

    constructor(
        private userRepository: UserRepository
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

            const deletedMessage = await this.userRepository.deleteUser(id);

            return {
                deletedMessage,
                errorMessage: null,
            };
        } catch (error) {
            console.log(error);
            return {
                deletedMessage: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}