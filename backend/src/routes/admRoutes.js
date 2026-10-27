import express from "express";

import {
  createAdm,
  listAdms,
  getAdm,
  updateAdm,
  deleteAdm
} from "../controllers/admController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware("ADM"), createAdm);
router.get("/", authMiddleware, roleMiddleware("ADM"), listAdms);
router.get("/:id", authMiddleware, roleMiddleware("ADM"), getAdm);
router.put("/:id", authMiddleware, roleMiddleware("ADM"), updateAdm);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADM"),
  deleteAdm
);

export default router;
