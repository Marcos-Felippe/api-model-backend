import express from "express";

import { GetUserController } from "../../../application/controllers/users/GetUserController";
import { CreateUserController } from "../../../application/controllers/users/CreateUserController";
import { DeleteUserController } from "../../../application/controllers/users/DeleteUserController";
import { UpdateUserController } from "../../../application/controllers/users/UpdateUserController";
import { LoginUserController } from "../../../application/controllers/users/LoginUserController";
import { authentication } from "../mildlewares/auth";

const router = express.Router();

// Controllers:
const loginUserController = new LoginUserController();

const getUserController = new GetUserController();
const createUserController = new CreateUserController();
const deleteUserController = new DeleteUserController();
const updateUserController = new UpdateUserController();

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

export default router;