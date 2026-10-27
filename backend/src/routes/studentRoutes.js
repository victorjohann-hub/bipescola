import express from "express";

import {
  createStudent,
  listStudents,
  getStudent,
  listStudentsByParent,
  listStudentsByTurma,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Criar aluno (apenas ADM)
router.post("/", authMiddleware, roleMiddleware("ADM"), createStudent);

// Listar alunos (ADM, PROF, PORTEIRO)
router.get("/", authMiddleware, roleMiddleware("ADM", "PROF", "PORTEIRO"), listStudents);

// Listar alunos por pai (autenticado)
router.get("/pai/:id", authMiddleware, listStudentsByParent);

// Listar alunos por turma (ADM, PROF, PORTEIRO)
router.get("/turma/:id", authMiddleware, roleMiddleware("ADM", "PROF", "PORTEIRO"), listStudentsByTurma);

// Buscar aluno por ID (autenticado)
router.get("/:id", authMiddleware, getStudent);

// Editar aluno (apenas ADM)
router.put("/:id", authMiddleware, roleMiddleware("ADM"), updateStudent);

// Deletar aluno (apenas ADM)
router.delete("/:id", authMiddleware, roleMiddleware("ADM"), deleteStudent);

export default router;
