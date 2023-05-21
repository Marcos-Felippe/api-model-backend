import { User } from "../../../domain/User";
import { UserRepository } from "./UserRepository";
import { UpdateUserDTO } from "./UserRepository";
import UserModel from "../../database/mongo/models/UserModel";
 
export class MongoUserRepository implements UserRepository {
    async create(user: User): Promise<User | null> {        
        const createdUser = await UserModel.create({
            id: user.ID,
            email: user.email,
            password: user.password
        });

        if(createdUser){

            const userParsed = new User({
                id: createdUser.id,
                email: createdUser.email,
                password: createdUser.password
            });

            return userParsed;
        }

        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await UserModel.findOne({ email });

        if(user){
            const userParsed = new User({
                id: user.id,
                email: user.email,
                password: user.password
            });

            return userParsed;
        }
        
        return null;
    }

    async getUser(id: string): Promise<User | null> {
        const user = await UserModel.findOne({ id });

        if(user){
            const userParsed = new User({
                id: user.id,
                email: user.email,
                password: user.password
            });

            return userParsed;
        }
        
        return null;
    }

    async updateUser(data: UpdateUserDTO): Promise<string> {

        if(!data.email && data.password){
            await UserModel.findOneAndUpdate(
                { id: data.id },
                { $set: { 
                    password: data.password
                }},
            );
            return "Password Updated";
        }

        if(!data.password && data.email){
            await UserModel.findOneAndUpdate(
                { id: data.id },
                { $set: { 
                    email: data.email
                }},
            );
            return "Email Updated";
        }

        if(data.email && data.password){
            await UserModel.findOneAndUpdate(
                { id: data.id },
                { $set: { 
                    email: data.email,
                    password: data.password
                }},
            );

            return "Email and Password Updated";
        }

        return "Nothing Updated";
    }

    async deleteUser(id: string): Promise<string> {

        await UserModel.deleteOne({ id: id });

        return "User Deleted";
    }
}