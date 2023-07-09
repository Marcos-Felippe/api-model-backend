import { UserRepository, UpdateUserDTO } from "../../../infra/repositories/users/UserRepository";
import { passwordHash } from "../../../infra/services/encrypt";

export class UpdateUserUseCase {

    constructor(
        private userRepository: UserRepository
    ) {}

    async execute({
        id,
        email,
        password,
    }: UpdateUserDTO): Promise<{
        updateMessage: null;
        errorMessage: string;
    } | {
        updateMessage: string;
        errorMessage: null;
    }> {

        try {
            const user = await this.userRepository.getUser(
                id,
            );

            if(!user) {
                return {
                    updateMessage: null,
                    errorMessage: "Not Found"
                };
            }

            if(password){
                password = await passwordHash(password);
            }
            
            const updatedUserMessage = await this.userRepository.updateUser({id, email, password});

            return {
                updateMessage: updatedUserMessage,
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