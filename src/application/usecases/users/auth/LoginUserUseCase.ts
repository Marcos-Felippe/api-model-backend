import { UserRepository } from "../../../../infra/repositories/users/UserRepository";
import { signUser } from "../../../../infra/services/auth";
import { comparePassword } from "../../../../infra/services/encrypt";

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
        accessToken: null;
        refreshToken: null;
        expiresIn: null;
        userId: null;
        errorMessage: string;
    } | {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        userId: string;
        errorMessage: null;
    }> {

        try {
            const user = await this.userRepository.findByEmail(email);
            const secretAccess = process.env.JWT_SECRET;
            const secretRefresh = process.env.JWT_REFRESH_SECRET;

            if (!user) {
                return {
                    accessToken: null,
                    refreshToken: null,
                    expiresIn: null,
                    userId: null,
                    errorMessage: "Not Found"
                };
            }

            if(!secretAccess || !secretRefresh){
                return {
                    accessToken: null,
                    refreshToken: null,
                    expiresIn: null,
                    userId: null,
                    errorMessage: "Internal Server Error"
                };
            }
        
            const passwordMatch = await comparePassword(password, user.password);

            if (!passwordMatch) {
                return {
                    accessToken: null,
                    refreshToken: null,
                    expiresIn: null,
                    userId: null,
                    errorMessage: "Not Found"
                };
            }
            
            const { accessToken, refreshToken, expiresIn } = signUser(user, secretAccess, secretRefresh);

            return {
                accessToken,
                refreshToken,
                expiresIn,
                userId: user.ID,
                errorMessage: null
            };
            
        } catch (error) {
            return {
                accessToken: null,
                refreshToken: null,
                expiresIn: null,
                userId: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}