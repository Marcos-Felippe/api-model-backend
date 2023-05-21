import { UserRepository } from "../../../infra/repositories/users/UserRepository";
import { signUser } from "../../../infra/services/auth";
import { comparePassword } from "../../../infra/services/encrypt";

interface LoginUserRequest {
    email: string
    password: string
}

export class LoginUserUseCase {

    constructor(
        private userRepository: UserRepository
    ) {}

    async execute({
        email,
        password,
    }: LoginUserRequest): Promise<{
        token: null;
        errorMessage: string;
    } | {
        token: string;
        errorMessage: null;
    }> {

        try {
            const user = await this.userRepository.findByEmail(email);
            const secret = process.env.JWT_SECRET;

            if (!user) {
                return {
                    token: null,
                    errorMessage: "Not Found"
                };
            }

            if(!secret){
                return {
                    token: null,
                    errorMessage: "Internal Server Error"
                };
            }
        
            const passwordMatch = await comparePassword(password, user.password);

            if (!passwordMatch) {
                return {
                    token: null,
                    errorMessage: "Not Found"
                };
            }
            
            const token = signUser(user, secret);

            return {
                token,
                errorMessage: null
            };
        } catch (error) {
            console.log(error);
            return {
                token: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}