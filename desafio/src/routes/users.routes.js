import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { upload } from "../midleware/multer.js";

const router = Router();

router.get("/", UserController.getAllUsers);

router.post("/:uid/documents", upload.any(), UserController.uploadDocuments);

router.put("/premium/:uid", UserController.changeRol);

router.delete("/", UserController.deleteInactiveUsers);


export { router as usersRouter };

