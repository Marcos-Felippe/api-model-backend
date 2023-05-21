import { User } from "../../../domain/User";

export interface UpdateUserDTO {
    id: string
    email?: string
    password?: string
}

export interface UserRepository {
    create(user: User): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    getUser(id: string): Promise<User | null>;
    updateUser(data: UpdateUserDTO): Promise<string>;
    deleteUser(id: string): Promise<string>;
}