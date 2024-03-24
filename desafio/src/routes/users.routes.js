import { Router } from "express";
import User from "../dao/models/user.model.js";
import { UserController } from "../controllers/users.controller.js";

const router =  Router();

router.put("/premium/:uid" , UserController.changeRol);

export {router as usersRouter};