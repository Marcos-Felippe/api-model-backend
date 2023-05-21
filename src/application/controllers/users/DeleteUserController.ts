import { Request, Response } from "express";
import { MongoUserRepository } from "../../../infra/repositories/users/MongoUserRepository";
import { DeleteUserUseCase } from "../../usecases/users/DeleteUserUseCase";

export class DeleteUserController {
    async handle(request: Request, response: Response) {
        const { id } = request.params;

        if(!id){
            return response.status(400).json("You need to pass an id");
        }

        const userRepository = new MongoUserRepository();
        const deleteUserUseCase = new DeleteUserUseCase(
            userRepository
        );

        const { deletedMessage, errorMessage } = await deleteUserUseCase.execute(id);

        if(errorMessage){
            if(errorMessage == "Not Found"){
                return response.status(404).json("Not Found");
            }

            else{
                return response.status(500).json("Internal Server Error");
            }
        }

        return response.status(200).json({
            deletedMessage
        });
    }
}