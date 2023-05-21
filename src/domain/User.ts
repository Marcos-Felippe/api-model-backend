import { v4 as uuid } from "uuid";
import { passwordHash } from "../infra/services/encrypt";

export interface UserProps {
    id?: string
    email: string
    password: string
}

export class User {
    private props: UserProps;

    get ID(){
        return this.props.id;
    }

    get email(){
        return this.props.email;
    }

    get password(){
        return this.props.password;
    }

    async encrypt(){
        const encryptedPassword = await passwordHash(this.props.password);
        this.props.password = encryptedPassword;
    }

    constructor(props: UserProps) {
        if(props.email == null || props.email == ""){
            throw new Error("Invalid Email");
        }

        if(props.password == null || props.password == ""){
            throw new Error("Invalid Password");
        }

        if(!props.id){
            props.id = uuid();
        }

        this.props = props;
    }
}