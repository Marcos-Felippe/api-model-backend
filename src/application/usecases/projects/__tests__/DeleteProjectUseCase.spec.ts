import { describe, expect, it } from "vitest";

import { InMemoryProjectRepository } from "../../../../infra/repositories/projects/in-memory/InMemoryProjectRepository";
//import { MongoProjectRepository } from "../../../../infra/repositories/Projects/MongoProjectRepository";
import { DeleteProjectUseCase } from "../DeleteProjectUseCase";
import { Project } from "../../../../domain/Project";
import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";

describe("Delete Project Use Case Tests", () => {
    it("should be able to delete an project", async () => {

        const project = new Project({
            title: "Title new del",
            description: "Description new del",
            owner: "12345-abc"
        });

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        let owner = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
            owner = projectCreated.owner;
        }

        const deleteProjectUseCase = new DeleteProjectUseCase(
            projectsRepository,
            userRepository
        );

        const { deletedMessage, errorMessage } = await deleteProjectUseCase.execute({id, owner});

        expect(deletedMessage).toEqual("Project Deleted");
        expect(errorMessage).toBeNull();
    });

    it("should return a not found error when try to delete an project", async () => {
        
        const id = "1";
        const owner ="userid1";

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const deleteProjectUseCase = new DeleteProjectUseCase(
            projectsRepository,
            userRepository
        );

        const { deletedMessage, errorMessage } = await deleteProjectUseCase.execute({id, owner});

        expect(errorMessage).toEqual("Not Found");
        expect(deletedMessage).toBeNull();
    });
});