import { Document, Schema, Model, model } from 'mongoose';

export interface IMember extends Document {
    firstName: string,
    lastName: string,
    email: string,
    passw: string,
    classCompletionDate: Date,
    skills: string[],
    role: string,
    token: string,
    createdAt: Date,
    updatedAt: Date,
}

const MemberSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    passw: { type: String, required: true },
    classCompletionDate: { type: Date, required: true },
    skills: { type: [String], required: true },
    role: { type: String, enum: ['admin', 'standard'], required: true },
    token: { type: String, default: 0 },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
});

const Member: Model<IMember> = model('Member', MemberSchema);
export default Member;