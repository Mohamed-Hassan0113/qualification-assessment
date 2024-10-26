import mongoose, { Schema, Document } from "mongoose";

interface IOrganizationMember {
    name: string;
    email: string;
    access_level: string;
}

interface IOrganization extends Document {
    name: string;
    description: string;
    organization_members: IOrganizationMember[];
}

const organizationSchema: Schema = new Schema<IOrganization>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    organization_members: [
        {
            name: { type: String },
            email: { type: String },
            access_level: { type: String },
        },
    ],
});

export default mongoose.model<IOrganization>("OrganizationInfo", organizationSchema);
