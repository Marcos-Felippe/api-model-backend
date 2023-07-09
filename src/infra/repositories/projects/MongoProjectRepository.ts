import { Project } from "../../../domain/Project";
import ProjectModel from "../../database/mongo/models/ProjectModel";
import { GetProjectDTO, ProjectRepository, UpdateProjectDTO } from "./ProjectRepository";
 
export class MongoProjectRepository implements ProjectRepository {
    async create(project: Project): Promise<Project | null> {        
        const createdProject = await ProjectModel.create({
            id: project.id,
            title: project.title,
            description: project.description,
            owner: project.owner
        });

        if(createdProject){

            const projectParsed = new Project({
                id: createdProject.id,
                title: createdProject.title,
                description: createdProject.description,
                owner: createdProject.owner
            });

            return projectParsed;
        }

        return null;
    }

    async getProject({id, title, owner}: GetProjectDTO): Promise<Project | null> {

        if(id){
            const project = await ProjectModel.findOne({ id });

            if(project){
                const projectParsed = new Project({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    owner: project.owner
                });

                return projectParsed;
            }
        }
        if(title && owner){
            const project = await ProjectModel.findOne({ title, owner });

            if(project){
                const projectParsed = new Project({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    owner: project.owner
                });

                return projectParsed;
            }
        }
        
        return null;
    }

    async getUserProjects(owner: string): Promise<Project[] | null> {
        const projects = await ProjectModel.find({ owner });
        let projectsList: Project[];

        if(projects[0]){
            projectsList = projects.map(project => {
                return new Project({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    owner: project.owner
                });
            });

            return projectsList;
        }
        
        return null;
    }

    async updateProject(data: UpdateProjectDTO): Promise<string> {

        if(!data.title && data.description){
            await ProjectModel.findOneAndUpdate(
                {
                    id: data.id,
                    owner: data.owner
                },
                { $set: { 
                    description: data.description
                }},
            );
            return "Description Updated";
        }

        if(!data.description && data.title){
            await ProjectModel.findOneAndUpdate(
                {
                    id: data.id,
                    owner: data.owner
                },
                { $set: { 
                    title: data.title
                }},
            );
            return "Title Updated";
        }

        if(data.title && data.description){
            await ProjectModel.findOneAndUpdate(
                {
                    id: data.id,
                    owner: data.owner
                },
                { $set: {
                    title: data.title,
                    description: data.description
                }},
            );

            return "Title and Description Updated";
        }

        return "Nothing Updated";
    }

    async deleteProject(id: string, owner: string): Promise<string> {

        await ProjectModel.deleteOne({ id: id, owner: owner });

        return "Project Deleted";
    }

    async deleteUserProjects(owner: string): Promise<string> {
        await ProjectModel.deleteMany({ owner: owner });

        return "Projects Deleted";
    }
}