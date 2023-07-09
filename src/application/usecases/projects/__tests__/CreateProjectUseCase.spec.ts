import { describe, expect, it } from "vitest";

import { InMemoryProjectRepository } from "../../../../infra/repositories/projects/in-memory/InMemoryProjectRepository";
//import { MongoProjectRepository } from "../../../../infra/repositories/projects/MongoProjectRepository";
import { CreateProjectUseCase } from "../CreateProjectUseCase";
import { Project } from "../../../../domain/Project";
import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";

describe("Create Project Use Case Tests", () => {
    it("should be able to create an project", async () => {
        
        const title = "Title new create";
        const description = "Description new create";
        const owner = "12345-abc";

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const createProjectUseCase = new CreateProjectUseCase(
            projectsRepository,
            userRepository
        );

        const {project, errorMessage} = await createProjectUseCase.execute({title, description, owner});

        expect(project).toBeInstanceOf(Project);
        expect(project?.title).toEqual(title);
        expect(project?.description).toEqual(description);
        expect(project?.owner).toEqual(owner);
        expect(errorMessage).toBeNull();
    });

    it("should return an project already exists error when try to create an project", async () => {
        
        const title1 = "Title new create";
        const description1 = "Description new create";
        const owner = "12345-abc";

        const title2 = "Title new create";
        const description2 = "Description new create";

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const createProjectUseCase = new CreateProjectUseCase(
            projectsRepository,
            userRepository
        );

        const {project: project1, errorMessage: message1} = await createProjectUseCase.execute({title: title1, description: description1, owner: owner});
        const {project: project2, errorMessage: message2} = await createProjectUseCase.execute({title: title2, description: description2, owner: owner});

        expect(project1).toBeInstanceOf(Project);
        expect(project1?.title).toEqual(title1);
        expect(project1?.description).toEqual(description1);
        expect(project1?.owner).toEqual(owner);
        expect(message1).toBeNull();

        expect(message2).toEqual("Project Already Exists");
        expect(project2).toBeNull();
    });

    it("should return an not found error when try to create an project", async () => {
        
        const title = "Title new create";
        const description = "Description new create";
        const owner = "wbqw";

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const createProjectUseCase = new CreateProjectUseCase(
            projectsRepository,
            userRepository
        );

        const {project: project, errorMessage: message} = await createProjectUseCase.execute({title, description, owner});

        expect(message).toEqual("Not Found");
        expect(project).toBeNull();
    });
});