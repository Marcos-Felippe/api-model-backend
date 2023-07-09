import { describe, expect, it } from "vitest";
import { Project } from "./Project";

describe("Create Project Tests", () => {
    it("should be able to create an Project", async () => {
        
        const title = "title 1";
        const description = "description 1";
        const owner = "userid1";

        const project = new Project({
            title,
            description,
            owner
        });

        expect(project.id).is;
        expect(project).toBeInstanceOf(Project);
        expect(project.title).toEqual(title);
        expect(project.description).toEqual(description);
        expect(project.owner).toEqual(owner);
    });

    it("should return an invalid title error when try to create an Project", async () => {
        
        const title = "";
        const description = "description 1";
        const owner = "userid1";

        expect(() => {
            return new Project({
                title,
                description,
                owner
            });
        }).toThrow();
    });

    it("should return an invalid description error when try to create an Project", async () => {
        
        const title = "title 1";
        const description = "";
        const owner = "userid1";

        expect(() => {
            return new Project({
                title,
                description,
                owner
            });
        }).toThrow();
    });

    it("should return an invalid owner error when try to create an Project", async () => {
        
        const title = "title 1";
        const description = "description 1";
        const owner = "";

        expect(() => {
            return new Project({
                title,
                description,
                owner
            });
        }).toThrow();
    });
});