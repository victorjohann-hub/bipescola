import express from "express";

import {
  createProfessor,
  listProfessors,
  getProfessor,
  updateProfessor,
  deleteProfessor
} from "../controllers/teacherController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("ADM"), createProfessor);
router.get("/", authMiddleware, roleMiddleware("ADM"), listProfessors);
router.get("/:id", authMiddleware, roleMiddleware("ADM"), getProfessor);
router.put("/:id", authMiddleware, roleMiddleware("ADM"), updateProfessor);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADM"),
  deleteProfessor
);

export default router;
