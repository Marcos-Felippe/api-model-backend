import { generateAccessToken, verifyToken } from "../../../../infra/services/auth";

interface RefreshTokenRequest {
    id: string
    refreshToken?: string
}

export class RefreshTokenUseCase {

    async execute({
        id,
        refreshToken,
    }: RefreshTokenRequest): Promise<{
        accessToken: null;
        refreshToken: null;
        userId: null;
        errorMessage: string;
    } | {
        accessToken: string;
        refreshToken: string;
        userId: string;
        errorMessage: null;
    }> {

        try {
            const secretAccess = process.env.JWT_SECRET;
            const secretRefresh = process.env.JWT_REFRESH_SECRET;

            if (!id) {
                return {
                    accessToken: null,
                    refreshToken: null,
                    userId: null,
                    errorMessage: "Internal Server Error"
                };
            }

            if(!secretAccess || !secretRefresh){
                return {
                    accessToken: null,
                    refreshToken: null,
                    userId: null,
                    errorMessage: "Internal Server Error"
                };
            }

            const decoded = verifyToken(refreshToken, secretRefresh);

            const { subject: userId } = decoded;

            if (id != userId) {
                return {
                    accessToken: null,
                    refreshToken: null,
                    userId: null,
                    errorMessage: "Internal Server Error"
                };
            }
            
            const newAccessToken = generateAccessToken(userId, secretAccess);

            return {
                accessToken: newAccessToken,
                refreshToken,
                userId,
                errorMessage: null
            };
            
        } catch (error) {
            return {
                accessToken: null,
                refreshToken: null,
                userId: null,
                errorMessage: "Internal Server Error"
            };
        }
    }
}