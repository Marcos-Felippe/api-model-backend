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
        userId: null;
        errorMessage: string;
    } | {
        token: string;
        userId: string;
        errorMessage: null;
    }> {

        try {
            const user = await this.userRepository.findByEmail(email);
            const secret = process.env.JWT_SECRET;

            if (!user) {
                return {
                    token: null,
                    userId: null,
                    errorMessage: "Not Found"
                };
            }

            if(!secret){
                return {
                    token: null,
                    userId: null,
                    errorMessage: "Internal Server Error"
                };
            }
        
            const passwordMatch = await comparePassword(password, user.password);

            if (!passwordMatch) {
                return {
                    token: null,
                    userId: null,
                    errorMessage: "Not Found"
                };
            }
            
            const token = signUser(user, secret);

            return {
                token,
                userId: user.ID,
                errorMessage: null
            };
            
        } catch (error) {
            return {
                token: null,
                userId: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}