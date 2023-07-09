import { Project, ProjectProps } from "../../../../domain/Project";
import { UpdateProjectDTO, ProjectRepository, GetProjectDTO } from "../ProjectRepository";

 
export class InMemoryProjectRepository implements ProjectRepository {

    public items: ProjectProps[] = [{
        id: "hrhwhw",
        title: "Title 1",
        description: "Description 1",
        owner: "userid1"
    }, {
        id: "whwrhw",
        title: "Title 2",
        description: "Description 2",
        owner: "userid2"
    },{
        id: "1adbsfnwh",
        title: "Title 3",
        description: "Description 3",
        owner: "userid1"
    },{
        id: "1adbsfnwh",
        title: "Title 4",
        description: "Description 4",
        owner: "12345-abc"
    },{
        id: "1adbsfnwh",
        title: "Title 5",
        description: "Description 5",
        owner: "12345-abc"
    }];

    async create(projectData: Project): Promise<Project | null> {
        const project: ProjectProps = {
            id: projectData.id,
            title: projectData.title,
            description: projectData.description,
            owner: projectData.owner,
        };

        this.items.push(project);
        return projectData;
    }

    async getProject({id, title, owner}: GetProjectDTO): Promise<Project | null> {

        if(id){
            const projectLocal = this.items.find(Project => Project.id === id);

            if(projectLocal?.id === id) {
                const project = new Project({
                    id: projectLocal.id,
                    title: projectLocal.title,
                    description: projectLocal.description,
                    owner: projectLocal.owner
                });

                return project;
            }
        }

        if(title && owner){
            const projectLocal = this.items.find(Project => Project.title === title);

            if(projectLocal?.title === title && projectLocal?.owner === owner) {
                const project = new Project({
                    id: projectLocal.id,
                    title: projectLocal.title,
                    description: projectLocal.description,
                    owner: projectLocal.owner
                });

                return project;
            }
        }
        

        return null;
    }

    async getUserProjects(owner: string): Promise<Project[] | null> {

        let projects: Project[] = this.items.map(project => {

            if(project?.owner === owner) {
                return new Project({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    owner: project.owner
                });
            }

        });

        projects = projects.filter(project => project);

        return projects;
    }

    async updateProject(data: UpdateProjectDTO): Promise<string> {

        let message = "";

        this.items = this.items.map(project => {
        
            if (project.id == data.id && project && project.owner == data.owner) {

                if(!data.title && data.description){
                    project.description = data.description;
                    message = "Description Updated";
                }

                if(!data.description && data.title){
                    project.title = data.title;
                    message = "Title Updated";
                }

                if(data.description && data.title){
                    project.title = data.title;
                    project.description = data.description;
                    message = "Title and Description Updated";
                }
            }

            return project;
        });

        return message;
    }

    async deleteProject(id: string, owner: string): Promise<string> {
        
        const projectLocal = this.items.find(project => project.id === id);

        if(projectLocal?.id === id && projectLocal?.owner === owner) {
            this.items = this.items.filter(project => project.id !== id);
            return "Project Deleted";
        }

        return "Not Found";
    }

    async deleteUserProjects(owner: string): Promise<string> {
        this.items = this.items.filter(project => project.owner === owner);
        return "Projects Deleted";
    }
}