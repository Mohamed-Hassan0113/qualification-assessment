"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orgController_1 = require("../controllers/orgController");
const isLoggedMiddleware_1 = __importDefault(require("../middlewares/isLoggedMiddleware"));
const router = express_1.default.Router();
router.post("/", isLoggedMiddleware_1.default, orgController_1.createOrganization);
router.get("/:organization_id", isLoggedMiddleware_1.default, orgController_1.readOrganization);
router.get("/", isLoggedMiddleware_1.default, orgController_1.readAllOrganizations);
router.put("/:organization_id", isLoggedMiddleware_1.default, orgController_1.updateOrganization);
router.delete("/:organization_id", isLoggedMiddleware_1.default, orgController_1.deleteOrganization);
router.post("/:organization_id/invite", isLoggedMiddleware_1.default, orgController_1.inviteUser);
exports.default = router;
