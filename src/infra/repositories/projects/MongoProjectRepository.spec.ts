import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { Project } from "../../../domain/Project";
import mongoose from "mongoose";
import { config } from "../../database/mongo/config/database";
import { MongoProjectRepository } from "./MongoProjectRepository";

const uri = config.url;

const projectsRepository = new MongoProjectRepository();

let id_get = "";
let owner_get = "";
let id_delete = "";
let owner_delete = "";
const owner_delete_many = "userid1mongo-repo-test-delete1";
let id_update = "";
let owner_update = "";
let id_post = "";
let owner_post = "";

// Gerando uma conexão com o db e adicionando os Projects necessarios para alguns testes no db anteriormente
beforeAll(async () => {
    await mongoose.connect(uri).
        catch(error => console.log(error));

    // Project para o teste get
    const project1 = new Project({
        title: "Title mongo-repo-test-get",
        description: "Description mongo-repo-test-get",
        owner: "userid1mongo-repo-test-get"
    });

    const projectCreated1 = await projectsRepository.create(
        project1
    );

    // Project para o teste delete
    const project2 = new Project({
        title: "Title mongo-repo-test-delete",
        description: "Description mongo-repo-test-delete",
        owner: "userid1mongo-repo-test-delete"
    });

    const projectCreated2 = await projectsRepository.create(
        project2
    );

    // Project para o teste update
    const project3 = new Project({
        title: "Title mongo-repo-test-update",
        description: "Description mongo-repo-test-update",
        owner: "userid1mongo-repo-test-update"
    });

    const projectCreated3 = await projectsRepository.create(
        project3
    );

    // Projects para o teste delete many
    const project4 = new Project({
        title: "Title mongo-repo-test-delete1",
        description: "Description mongo-repo-test-delete1",
        owner: owner_delete_many
    });

    await projectsRepository.create(project4);

    const project5 = new Project({
        title: "Title mongo-repo-test-delete2",
        description: "Description mongo-repo-test-delete2",
        owner: owner_delete_many
    });

    await projectsRepository.create(project5);


    id_get = projectCreated1.id;
    id_delete = projectCreated2.id;
    id_update = projectCreated3.id;

    owner_get = projectCreated1.owner;
    owner_delete = projectCreated2.owner;
    owner_update = projectCreated3.owner;

});

// Limpando o banco após os testes e fechando a conexão com o banco 
afterAll(async () => {
    await projectsRepository.deleteProject(id_post, owner_post);
    await projectsRepository.deleteProject(id_get, owner_get);
    await projectsRepository.deleteProject(id_update, owner_update);

    mongoose.connection.close();
});


describe("Mongo Project Repository Create Project Tests", () => {
    it("should be able to save an project", async () => {
        
        const project = new Project({
            title: "Title mongo-repo-test-create",
            description: "Description mongo-repo-test-create",
            owner: "userid1mongo-repo-test-create"
        });

        const projectCreated = await projectsRepository.create(
            project
        );

        id_post = projectCreated.id;
        owner_post = projectCreated.owner;

        expect(projectCreated).toBeInstanceOf(Project);
        expect(projectCreated?.id).is;
        expect(projectCreated?.title).toEqual(project.title);
        expect(projectCreated?.description).toEqual(project.description);
        expect(projectCreated?.owner).toEqual(project.owner);
    });
});

describe("Mongo Project Repository Get Project Tests", () => {
    it("should be able to get an project by id", async () => {

        const project = await projectsRepository.getProject({id: id_get});

        expect(project).toBeInstanceOf(Project);
        expect(project?.title).toEqual("Title mongo-repo-test-get");
        expect(project?.description).toEqual("Description mongo-repo-test-get");
        expect(project?.owner).toEqual(owner_get);
    });

    it("should not be able to get an project by id", async () => {

        const project = await projectsRepository.getProject({id: "1"});

        expect(project).toBeNull();
    });

    it("should be able to get an project by title and owner", async () => {

        const title = "Title mongo-repo-test-get";

        const project = await projectsRepository.getProject({
            title,
            owner: owner_get
        });

        expect(project).toBeInstanceOf(Project);
        expect(project?.title).toEqual(title);
        expect(project?.description).toEqual("Description mongo-repo-test-get");
        expect(project?.owner).toEqual(owner_get);
    });

    it("should not be able to get an project by title and owner", async () => {

        const title = "Title however";
        const owner = "userid1";

        const project = await projectsRepository.getProject({
            title,
            owner
        });

        expect(project).toBeNull();
    });
});

describe("Mongo Project Repository Get Many Projects Tests", () => {
    it("should be able to get a list of projects", async () => {

        const projectsRepository = new MongoProjectRepository();

        const projects = await projectsRepository.getUserProjects(
            owner_get
        );

        expect(projects[0].title).toEqual("Title mongo-repo-test-get");
        expect(projects[0].description).toEqual("Description mongo-repo-test-get");
        expect(projects[0].owner).toEqual(owner_get);
    });

    it("should not be able to get a list of projects", async () => {

        const projects = await projectsRepository.getUserProjects("userid1");

        expect(projects).toBeNull();
    });
});

describe("Mongo Project Repository Update Project Tests", () => {
    it("should be able to update an project title and description", async () => {
        
        const title = "Title mongo-repo-test-update1";
        const description = "Description mongo-repo-test-update1";

        const updatedMessage = await projectsRepository.updateProject({id: id_get, title, description, owner: "userid1mongo-repo-test-update"});

        expect(updatedMessage).toEqual("Title and Description Updated");
    });

    it("should be able to update an project title", async () => {
        
        const title = "Title mongo-repo-test-update2";

        const updatedMessage = await projectsRepository.updateProject({id: id_get, title, owner: "userid1mongo-repo-test-update"});

        expect(updatedMessage).toEqual("Title Updated");
    });

    it("should be able to update an project description", async () => {
        
        const description = "Description mongo-repo-test-update2";

        const updatedMessage = await projectsRepository.updateProject({id: id_get, description, owner: "userid1mongo-repo-test-update"});

        expect(updatedMessage).toEqual("Description Updated");
    });
});

describe("Mongo Project Repository Delete Project Tests", () => {
    it("should be able to delete an project", async () => {
        
        const deletedMessage = await projectsRepository.deleteProject(id_delete, owner_delete);

        expect(deletedMessage).toEqual("Project Deleted");
    });
});

describe("Mongo Project Repository Delete Many Projects Tests", () => {
    it("should be able to delete a list of projects", async () => {

        const projectsRepository = new MongoProjectRepository();

        const deletedMessage = await projectsRepository.deleteUserProjects(
            owner_delete_many
        );

        const projects = await projectsRepository.getUserProjects(owner_delete_many);

        expect(projects).toBeNull();
        expect(deletedMessage).toEqual("Projects Deleted");
    });
});