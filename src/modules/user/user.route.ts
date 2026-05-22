import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/", userController.createUser);

router.get("/", userController.getAllUser);

router.get("/:id", userController.getAnUser);

router.put("/:id", userController.updateAnUser);

router.delete("/:id", userController.deleteUser);

export const userRouter = router;
