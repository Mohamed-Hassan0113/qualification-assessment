"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteUser = exports.deleteOrganization = exports.updateOrganization = exports.readAllOrganizations = exports.readOrganization = exports.createOrganization = void 0;
const Organization_1 = __importDefault(require("../models/Organization"));
const User_1 = __importDefault(require("../models/User"));
const createOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const userId = req.userID;
    try {
        const user = yield User_1.default.findById(userId);
        const organization = new Organization_1.default({
            name,
            description,
            organization_members: [
                { name: user.name, email: user.email, access_level: "admin" },
            ],
        });
        yield organization.save();
        res.status(201).json({ organization_id: organization._id });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.createOrganization = createOrganization;
const readOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { organization_id } = req.params;
    try {
        const organization = yield Organization_1.default.findById(organization_id).populate("organization_members");
        if (!organization) {
            const error = new Error("Organization not found.");
            error.statusCode = 404;
            throw error;
        }
        res.json(organization);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.readOrganization = readOrganization;
const readAllOrganizations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const organizations = yield Organization_1.default.find().populate("organization_members");
        res.json(organizations);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.readAllOrganizations = readAllOrganizations;
const updateOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { organization_id } = req.params;
    const { name, description } = req.body;
    try {
        const organization = yield Organization_1.default.findByIdAndUpdate(organization_id, { name, description }, { new: true });
        if (!organization) {
            const error = new Error("Organization not found.");
            error.statusCode = 404;
            throw error;
        }
        res.json({
            organization_id: organization._id,
            name: organization.name,
            description: organization.description,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.updateOrganization = updateOrganization;
const deleteOrganization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { organization_id } = req.params;
    try {
        const organization = yield Organization_1.default.findByIdAndDelete(organization_id);
        if (!organization) {
            const error = new Error("Organization not found.");
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: "Organization deleted successfully." });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.deleteOrganization = deleteOrganization;
const inviteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { organization_id } = req.params;
    const { user_email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email: user_email });
        // Check if a user with the provided email exists
        if (!user) {
            const error = new Error("User with such email not found.");
            error.statusCode = 404;
            throw error;
        }
        const organization = yield Organization_1.default.findById(organization_id);
        // Check if an organization is found
        if (!organization) {
            const error = new Error("Organization not found.");
            error.statusCode = 404;
            throw error;
        }
        organization.organization_members.push({
            name: user.name,
            email: user_email,
            access_level: "member",
        });
        yield organization.save();
        res.json({ message: `User ${user_email} invited successfully.` });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
});
exports.inviteUser = inviteUser;
