import express, { Router } from "express";
import { createOrganization, readOrganization, readAllOrganizations, updateOrganization, deleteOrganization, inviteUser } from "../controllers/orgController";
import isLogged from "../middlewares/isLoggedMiddleware";

const router: Router = express.Router();

router.post("/", isLogged, createOrganization);
router.get("/:organization_id", isLogged, readOrganization);
router.get("/", isLogged, readAllOrganizations);
router.put("/:organization_id", isLogged, updateOrganization);
router.delete("/:organization_id", isLogged, deleteOrganization);
router.post("/:organization_id/invite", isLogged, inviteUser);

export default router;
