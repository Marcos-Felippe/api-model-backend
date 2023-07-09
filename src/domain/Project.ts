import { v4 as uuid } from "uuid";

export interface ProjectProps {
    id?: string
    title: string
    description: string
    owner: string
}

export class Project {
    private props: ProjectProps;

    get id(){
        return this.props.id;
    }

    get title(){
        return this.props.title;
    }

    get description(){
        return this.props.description;
    }

    get owner(){
        return this.props.owner;
    }

    constructor(props: ProjectProps) {
        if(props.title == null || props.title == ""){
            throw new Error("Invalid Title");
        }

        if(props.description == null || props.description == ""){
            throw new Error("Invalid Description");
        }

        if(props.owner == null || props.owner == ""){
            throw new Error("Invalid Owner");
        }

        if(!props.id){
            props.id = uuid();
        }

        this.props = props;
    }
}