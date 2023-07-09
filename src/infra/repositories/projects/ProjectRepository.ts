import { Project } from "../../../domain/Project";

export interface GetProjectDTO {
    id?: string
    title?: string
    owner?: string
}

export interface UpdateProjectDTO {
    id: string
    title?: string
    description?: string
    owner: string
}

export interface ProjectRepository {
    create(Project: Project): Promise<Project | null>;
    getProject({id, title, owner}: GetProjectDTO): Promise<Project | null>;
    getUserProjects(owner: string): Promise<Project[] | null>;
    updateProject(data: UpdateProjectDTO): Promise<string>;
    deleteProject(id: string, owner: string): Promise<string>;
    deleteUserProjects(owner: string): Promise<string>;
}