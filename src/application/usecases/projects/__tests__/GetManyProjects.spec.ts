import { describe, expect, it } from "vitest";

import { InMemoryProjectRepository } from "../../../../infra/repositories/projects/in-memory/InMemoryProjectRepository";
//import { MongoProjectRepository } from "../../../../infra/repositories/Projects/MongoProjectRepository";
import { GetManyProjectsUseCase } from "../GetManyProjectsUseCase";
import { InMemoryUserRepository } from "../../../../infra/repositories/users/in-memory/InMemoryUserRepository";

describe("Get Many Projects Use Case Tests", () => {
    it("should be able to get many projects", async () => {

        const owner = "12345-abc";

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const getManyProjectsUseCase = new GetManyProjectsUseCase(
            projectsRepository,
            userRepository
        );

        const {projects, errorMessage } = await getManyProjectsUseCase.execute({ owner });

        expect(projects[0]?.title).toEqual("Title 4");
        expect(projects[0]?.description).toEqual("Description 4");
        expect(projects[0]?.owner).toEqual("12345-abc");

        expect(projects[1]?.title).toEqual("Title 5");
        expect(projects[1]?.description).toEqual("Description 5");
        expect(projects[1]?.owner).toEqual("12345-abc");

        expect(errorMessage).toBeNull();
    });

    it("should return a not found error when try to get many projects", async () => {
        
        const owner = "1";

        const projectsRepository = new InMemoryProjectRepository();
        const userRepository = new InMemoryUserRepository();

        const getManyProjectsUseCase = new GetManyProjectsUseCase(
            projectsRepository,
            userRepository
        );

        const {projects, errorMessage } = await getManyProjectsUseCase.execute({ owner });

        expect(projects).toBeNull();
        expect(errorMessage).toEqual("Not Found");
    });
});