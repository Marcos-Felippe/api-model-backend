import { describe, expect, it } from "vitest";
import { Project } from "../../../../domain/Project";
import { InMemoryProjectRepository } from "./InMemoryProjectRepository";

describe("In Memory Create Project Tests", () => {
    it("should be able to save an project", async () => {
        
        const project = new Project({
            title: "Title new 1",
            description: "Description new 1",
            owner: "userid1"
        });

        const projectsRepository = new InMemoryProjectRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        expect(projectCreated?.id).is;
        expect(projectCreated).toBeInstanceOf(Project);
        expect(projectCreated?.title).toEqual(project.title);
        expect(projectCreated?.description).toEqual(project.description);
        expect(projectCreated?.owner).toEqual(project.owner);
    });
});

describe("In Memory Get Project Tests", () => {
    it("should be able to get an project by id", async () => {
        
        const id = "hrhwhw";

        const projectsRepository = new InMemoryProjectRepository();

        const project = await projectsRepository.getProject({
            id
        });

        expect(project).toBeInstanceOf(Project);
        expect(project?.title).toEqual("Title 1");
        expect(project?.description).toEqual("Description 1");
        expect(project?.owner).toEqual("userid1");
    });

    it("should not be able to get an project by id", async () => {
        
        const id = "1";

        const projectsRepository = new InMemoryProjectRepository();

        const project = await projectsRepository.getProject({
            id
        });

        expect(project).toBeNull;
    });

    it("should be able to get an project by title and owner", async () => {
        
        const title = "Title 1";
        const owner = "userid1";

        const projectsRepository = new InMemoryProjectRepository();

        const project = await projectsRepository.getProject({
            title,
            owner
        });

        expect(project).toBeInstanceOf(Project);
        expect(project?.title).toEqual("Title 1");
        expect(project?.description).toEqual("Description 1");
        expect(project?.owner).toEqual("userid1");
    });

    it("should not be able to get an project by title and owner", async () => {

        const title = "Title however";
        const owner = "userid1";

        const projectsRepository = new InMemoryProjectRepository();

        const project = await projectsRepository.getProject({
            title,
            owner
        });

        expect(project).toBeNull();
    });
});

describe("In Memory Get Many Projects Tests", () => {
    it("should be able to get a list of projects", async () => {
        
        const owner = "userid1";

        const projectsRepository = new InMemoryProjectRepository();

        const projects = await projectsRepository.getUserProjects(
            owner
        );

        expect(projects[0].title).toEqual("Title 1");
        expect(projects[0].description).toEqual("Description 1");
        expect(projects[0].owner).toEqual("userid1");

        expect(projects[1].title).toEqual("Title 3");
        expect(projects[1].description).toEqual("Description 3");
        expect(projects[1].owner).toEqual("userid1");
    });

    it("should not be able to get a list of projects", async () => {
        
        const owner = "userid3";

        const projectsRepository = new InMemoryProjectRepository();

        const projects = await projectsRepository.getUserProjects(
            owner
        );

        expect(projects).toBeNull;
    });
});

describe("In Memory Update Project Tests", () => {
    it("should be able to update an project title", async () => {

        const title = "Title updated 1";

        const project = new Project({
            title: "Title new 1",
            description: "Description new 1",
            owner: "userid1"
        });

        const projectsRepository = new InMemoryProjectRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
        }

        const message = await projectsRepository.updateProject({id, title, owner: project.owner});
        
        expect(message).toEqual("Title Updated");
    });

    it("should be able to update an project description", async () => {
        
        const description = "Description updated 1";

        const project = new Project({
            title: "Title new 1",
            description: "Description new 1",
            owner: "userid1"
        });

        const projectsRepository = new InMemoryProjectRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
        }

        const message = await projectsRepository.updateProject({id, description, owner: project.owner});
        
        expect(message).toEqual("Description Updated");
    });

    it("should be able to update an complete project", async () => {
        
        const title = "Title updated 1";
        const description = "Description updated 1";

        const project = new Project({
            title: "Title new 1",
            description: "Description new 1",
            owner: "userid1"
        });

        const projectsRepository = new InMemoryProjectRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
        }

        const message = await projectsRepository.updateProject({id, title, description, owner: project.owner});
        
        expect(message).toEqual("Title and Description Updated");
    });
});

describe("In Memory Delete Project Tests", () => {
    it("should be able to delete an project", async () => {

        const project = new Project({
            title: "Title new 1",
            description: "Description new 1",
            owner: "userid1"
        });

        const projectsRepository = new InMemoryProjectRepository();

        const projectCreated = await projectsRepository.create(
            project
        );

        let id = "";
        
        if(projectCreated && projectCreated.id){
            id = projectCreated.id;
        }

        const deletedMessage = await projectsRepository.deleteProject(
            id,
            projectCreated.owner
        );

        expect(deletedMessage).toEqual("Project Deleted");
    });

    it("should not be able to delete an project", async () => {
        
        const id = "1";

        const projectsRepository = new InMemoryProjectRepository();

        const deletedMessage = await projectsRepository.deleteProject(
            id,
            "1"
        );

        expect(deletedMessage).toEqual("Not Found");
    });
});

describe("In Memory Delete Many Projects Tests", () => {
    it("should be able to delete many projects", async () => {

        const owner = "userid1";

        const projectsRepository = new InMemoryProjectRepository();

        const deletedMessage = await projectsRepository.deleteUserProjects(
            owner
        );

        const projects = await projectsRepository.getUserProjects(
            owner
        );

        expect(projects).toBeNull;
        expect(deletedMessage).toEqual("Projects Deleted");
    });

    it("should not be able to delete many projects", async () => {

        const owner = "userid4";

        const projectsRepository = new InMemoryProjectRepository();

        const deletedMessage = await projectsRepository.deleteUserProjects(
            owner
        );

        const projects = await projectsRepository.getUserProjects(
            owner
        );

        expect(projects).toBeNull;
        expect(deletedMessage).toEqual("Projects Deleted");
    });
});