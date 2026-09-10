import mongoose, { Schema, Document } from "mongoose";

export interface IPrompt extends Document {
  title: string;
  slug: string;
  prompt: string;
  category: string | string[];
  image: string;
  platform: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
  stats: {
    views: number;
    copies: number;
  };
}

const promptSchema = new Schema<IPrompt>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  prompt: { type: String, required: true },
  category: { type: Schema.Types.Mixed }, // string or array of strings
  image: { type: String, default: "" },
  platform: { type: String, default: "All Platforms" },
  tags: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  stats: {
    views: { type: Number, default: 0 },
    copies: { type: Number, default: 0 },
  },
});

export const Prompt = mongoose.models.Prompt || mongoose.model<IPrompt>("Prompt", promptSchema, "prompts");

export interface IAdmin extends Document {
  username: string;
  password?: string;
  last_login?: Date;
}

const adminSchema = new Schema<IAdmin>({
  username: { type: String, required: true },
  password: { type: String },
  last_login: { type: Date },
});

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>("Admin", adminSchema, "admins");
