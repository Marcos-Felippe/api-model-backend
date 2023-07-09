import { describe, expect, it } from "vitest";

import { InMemoryProjectRepository } from "../../../../infra/repositories/projects/in-memory/InMemoryProjectRepository";
//import { MongoProjectRepository } from "../../../../infra/repositories/Projects/MongoProjectRepository";
import { UpdateProjectUseCase } from "../UpdateProjectUseCase";
import { Project } from "../../../../domain/Project";
import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";

describe("Update Project Use Case Tests", () => {
    it("should be able to update an complete project", async () => {

        const title = "Title updated 1";
        const description = "Description updated 1";
        const owner = "12345-abc";

        const project = new Project({
            title: "Title new update",
            description: "Description new update",
            owner: "12345-abc"
        });

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
        }

        const updateProjectUseCase = new UpdateProjectUseCase(
            projectsRepository,
            userRepository
        );

        const messages = await updateProjectUseCase.execute({
            id,
            title,
            description,
            owner
        });
        
        expect(messages?.updateMessage).toEqual("Title and Description Updated");
        expect(messages?.errorMessage).toBeNull();
    });

    it("should be able to update an project title", async () => {

        const title = "Title updated 1";
        const owner = "12345-abc";

        const project = new Project({
            title: "Title new update",
            description: "Description new update",
            owner: "12345-abc"
        });

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
        }

        const updateProjectUseCase = new UpdateProjectUseCase(
            projectsRepository,
            userRepository
        );

        const messages = await updateProjectUseCase.execute({
            id,
            title,
            owner
        });
        
        expect(messages?.updateMessage).toEqual("Title Updated");
        expect(messages?.errorMessage).toBeNull();
    });

    it("should be able to update an project description", async () => {

        const description = "Description updated 1";
        const owner = "12345-abc";

        const project = new Project({
            title: "Title new update",
            description: "Description new update",
            owner: "12345-abc"
        });

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
        }

        const updateProjectUseCase = new UpdateProjectUseCase(
            projectsRepository,
            userRepository
        );

        const messages = await updateProjectUseCase.execute({
            id,
            description,
            owner
        });
        
        expect(messages?.updateMessage).toEqual("Description Updated");
        expect(messages?.errorMessage).toBeNull();
    });

    it("should return a not found error when try to update an project", async () => {

        const id = "1";
        const title = "Title updated 1";
        const description = "Description updated 1";
        const owner = "userid1";

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();
        
        const updateProjectUseCase = new UpdateProjectUseCase(
            projectsRepository,
            userRepository
        );

        const messages = await updateProjectUseCase.execute({
            id,
            title,
            description,
            owner
        });
        
        expect(messages?.errorMessage).toEqual("Not Found");
        expect(messages?.updateMessage).toBeNull();
    });
});