import { Request, Response } from "express";
import { CreateUserUseCase } from "../../usecases/users/CreateUserUseCase";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";

export class CreateUserController {
    async handle(request: Request, response: Response) {
        const { email, password } = request.body;

        if(!email || !password){
            return response.status(400).json("Missing Values");
        }

        const userRepository = new MongoUserRepository();
        const createUserUseCase = new CreateUserUseCase(
            userRepository
        );

        const {user, errorMessage} = await createUserUseCase.execute({
            email,
            password
        });

        // Retornando os erros do usecase se houverem
        if(errorMessage){
            if(errorMessage == "User Already Exists"){
                return response.status(422).json("User Already Exists");
            }

            else{
                return response.status(500).json("Internal Server Error");
            }
        }

        // Retorno caso não ocorram erros
        return response.status(201).json({
            user: {
                id: user?.ID,
                email: user?.email
            }
        });
    }
}