import { User } from "../../../../domain/User";
import { UpdateUserDTO, UserRepository } from "../UserRepository";

export interface UserModel {
    id?: string
    email: string
    password: string
}
 
export class InMemoryUserRepository implements UserRepository {

    public items: UserModel[] = [{
        id: "12345-abc",
        email: "emailteste@email.com",
        password: "1",
    }, {
        id: "09876-def",
        email: "emailteste2@email.com",
        password: "2",
    },{
        id: "19764-ghi",
        email: "emailteste3@email.com",
        password: "3",
    }];

    async create(userData: User): Promise<User | null> {
        const user = {
            id: userData.ID,
            email: userData.email,
            password: userData.password,
        };

        this.items.push(user);
        return userData;
    }

    async findByEmail(email: string): Promise<User | null> {
        const userLocal = this.items.find(user => user.email === email);

        if(userLocal?.email === email) {
            const user = new User({
                email: userLocal.email,
                password: userLocal.password,
            });

            return user;
        }

        return null;
    }

    async getUser(id: string): Promise<User | null> {
        const userLocal = this.items.find(user => user.id === id);

        if(userLocal?.id === id) {
            const user = new User({
                email: userLocal.email,
                password: userLocal.password,
            });

            return user;
        }

        return null;
    }

    async updateUser(data: UpdateUserDTO): Promise<string> {

        let message = "";

        this.items = this.items.map(user => {
        
            if (user.id == data.id && user) {

                if(!data.email && data.password){
                    user.password = data.password;
                    message = "Password Updated";
                }

                if(!data.password && data.email){
                    user.email = data.email;
                    message = "Email Updated";
                }

                if(data.password && data.email){
                    user.email = data.email;
                    user.password = data.password;
                    message = "Email and Password Updated";
                }
            }

            return user;
        });

        return message;
    }

    async deleteUser(id: string): Promise<string> {
        
        const userLocal = this.items.find(user => user.id === id);

        if(userLocal?.id === id) {
            this.items = this.items.filter(user => user.id !== id);
            return "User Deleted";
            
        }

        return "Not Found";
    }
}