import { User } from "../../../domain/User";
import { UserRepository } from "../../../infra/repositories/users/UserRepository";

interface GetUserRequest {
    id: string
}

type GetUserResponse = {
    user: null;
    errorMessage: string;
} | {
    user: User;
    errorMessage: null;
}

export class GetUserUseCase {

    constructor(
        private userRepository: UserRepository
    ) {}

    async execute({
        id,
    }: GetUserRequest): Promise<GetUserResponse> {

        try {
            const user = await this.userRepository.getUser(
                id,
            );

            if(!user) {
                return {
                    user: null,
                    errorMessage: "Not Found"
                };
            }

            return {
                user,
                errorMessage: null
            };
        } catch (error) {
            console.log(error);
            return {
                user: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}