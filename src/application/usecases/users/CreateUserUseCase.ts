import { User } from "../../../domain/User";
import { UserRepository } from "../../../infra/repositories/users/UserRepository";

interface CreateUserRequest {
    email: string
    password: string
}

export class CreateUserUseCase {

    constructor(
        private userRepository: UserRepository
    ) {}

    async execute({
        email,
        password,
    }: CreateUserRequest): Promise<{
        user: null;
        errorMessage: string;
    } | {
        user: User;
        errorMessage: null;
    }> {

        try {
            // Verificando se o usuario já existe no banco
            const userExists = await this.userRepository.findByEmail(
                email,
            );

            if(userExists) {
                return {
                    user: null,
                    errorMessage: "User Already Exists"
                };
            }
        
            const user = new User({
                email,
                password,
            });
            await user.encrypt();

            await this.userRepository.create(user);

            return {
                user: user,
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