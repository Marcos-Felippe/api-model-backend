import mongoose from "mongoose";

import {config} from "./database";

const uri = config.url;

async function main() {
    if(uri){
        await mongoose.connect(uri).
            catch(error => console.log(error));
    }
}

main().catch(err => console.log(err));

export default mongoose;