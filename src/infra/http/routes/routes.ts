import express from "express";

import { GetUserController } from "../../../application/controllers/users/GetUserController";
import { CreateUserController } from "../../../application/controllers/users/CreateUserController";
import { DeleteUserController } from "../../../application/controllers/users/DeleteUserController";
import { UpdateUserController } from "../../../application/controllers/users/UpdateUserController";
import { LoginUserController } from "../../../application/controllers/users/LoginUserController";

import { GetProjectController } from "../../../application/controllers/projects/GetProjectController";
import { DeleteProjectController } from "../../../application/controllers/projects/DeleteProjectController";
import { CreateProjectController } from "../../../application/controllers/projects/CreateProjectController";
import { UpdateProjectController } from "../../../application/controllers/projects/UpdateProjectController";

import { authentication } from "../mildlewares/auth";
import { GetManyProjectsController } from "../../../application/controllers/projects/GetManyProjectsController";

const router = express.Router();

// Controllers:
const loginUserController = new LoginUserController();

const getUserController = new GetUserController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();
const updateUserController = new UpdateUserController();

const getProjectController = new GetProjectController();
const getManyProjectsController = new GetManyProjectsController();
const createProjectController = new CreateProjectController();
const deleteProjectController = new DeleteProjectController();
const updateProjectController = new UpdateProjectController();


// Rotas:
router.get("/hello", (req, res) => {
    res.status(200).json({
        message: "Hello"
    });
});

router.post("/login", loginUserController.handle);

router.post("/user", createUserController.handle);
router.get("/user/:id", authentication, getUserController.handle);
router.patch("/user/:id", authentication, updateUserController.handle);
router.delete("/user/:id", authentication, deleteUserController.handle);

router.post("/user/:owner/project", createProjectController.handle);
router.get("/user/:owner/project/:id", authentication, getProjectController.handle);
router.get("/user/:owner/projects", authentication, getManyProjectsController.handle);
router.patch("/user/:owner/project/:id", authentication, updateProjectController.handle);
router.delete("/user/:owner/project/:id", authentication, deleteProjectController.handle);

export default router;