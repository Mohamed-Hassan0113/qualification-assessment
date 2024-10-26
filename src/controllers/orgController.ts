import { Request, Response } from "express";
import Organization from "../models/Organization";
import User from "../models/User";

export const createOrganization = async (req: any, res: Response) => {
    const { name, description } = req.body;
    const userId = req.userID;

    try {
        const user = await User.findById(userId);

        const organization = new Organization({
            name,
            description,
            organization_members: [
                { name: user!.name, email: user!.email, access_level: "admin" },
            ],
        });
        await organization.save();
        res.status(201).json({ organization_id: organization._id });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

export const readOrganization = async (req: Request, res: Response) => {
    const { organization_id } = req.params;
    try {
        const organization = await Organization.findById(organization_id).populate("organization_members");
        if (!organization) {
            const error = new Error("Organization not found.");
            (error as any).statusCode = 404;
            throw error;
        }
        res.json(organization);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

export const readAllOrganizations = async (req: Request, res: Response) => {
    try {
        const organizations = await Organization.find().populate("organization_members");
        res.json(organizations);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

export const updateOrganization = async (req: Request, res: Response) => {
    const { organization_id } = req.params;
    const { name, description } = req.body;
    try {
        const organization = await Organization.findByIdAndUpdate(
            organization_id,
            { name, description },
            { new: true }
        );
        if (!organization) {
            const error = new Error("Organization not found.");
            (error as any).statusCode = 404;
            throw error;
        }
        res.json({
            organization_id: organization._id,
            name: organization.name,
            description: organization.description,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

export const deleteOrganization = async (req: Request, res: Response) => {
    const { organization_id } = req.params;
    try {
        const organization = await Organization.findByIdAndDelete(organization_id);
        if (!organization) {
            const error = new Error("Organization not found.");
            (error as any).statusCode = 404;
            throw error;
        }
        res.json({ message: "Organization deleted successfully." });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};

export const inviteUser = async (req: Request, res: Response) => {
    const { organization_id } = req.params;
    const { user_email } = req.body;

    try {
        const user = await User.findOne({ email: user_email });

        // Check if a user with the provided email exists
        if (!user) {
            const error = new Error("User with such email not found.");
            (error as any).statusCode = 404;
            throw error;
        }

        const organization = await Organization.findById(organization_id);
        // Check if an organization is found
        if (!organization) {
            const error = new Error("Organization not found.");
            (error as any).statusCode = 404;
            throw error;
        }

        organization.organization_members.push({
            name: user.name,
            email: user_email,
            access_level: "member",
        });
        await organization.save();

        res.json({ message: `User ${user_email} invited successfully.` });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred." });
        }
    }
};
