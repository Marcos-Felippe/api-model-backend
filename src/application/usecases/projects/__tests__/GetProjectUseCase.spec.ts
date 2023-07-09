import { describe, expect, it } from "vitest";

import { InMemoryProjectRepository } from "../../../../infra/repositories/projects/in-memory/InMemoryProjectRepository";
//import { MongoProjectRepository } from "../../../../infra/repositories/Projects/MongoProjectRepository";
import { GetProjectUseCase } from "../GetProjectUseCase";
import { Project } from "../../../../domain/Project";

describe("Get Project Use Case Tests", () => {
    it("should be able to get an project", async () => {

        const id = "hrhwhw";

        const projectsRepository = new InMemoryProjectRepository();
        const getProjectUseCase = new GetProjectUseCase(
            projectsRepository
        );

        const {project, errorMessage } = await getProjectUseCase.execute({ id });

        expect(project).toBeInstanceOf(Project);
        expect(project?.title).toEqual("Title 1");
        expect(project?.description).toEqual("Description 1");
        expect(project?.owner).toEqual("userid1");
        expect(errorMessage).toBeNull();
    });

    it("should return a not found error when try to get an project", async () => {
        
        const id = "1";

        const projectsRepository = new InMemoryProjectRepository();
        const getProjectUseCase = new GetProjectUseCase(
            projectsRepository
        );

        const { project, errorMessage } = await getProjectUseCase.execute({ id });

        expect(project).toBeNull();
        expect(errorMessage).toEqual("Not Found");
    });
});