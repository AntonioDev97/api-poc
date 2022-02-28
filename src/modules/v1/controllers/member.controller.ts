import { Request, Response } from "express";
import { hdlResponse } from "../../../services/response-handler.service";
import ValidateSchema, { IValidateResponse } from "../../../services/validator.service";
import bcrypt from 'bcrypt';
import { Logger } from "../../../services/winston.service";
import Member, { IMember } from "../models/member.model";
import LoginSchema from "../schemas/login.schema";
import MemberSchema from "../schemas/member.schema";
import { IPayload, TokenService } from "../../../services/jwt.service";

export class MemberController {
    public async login(request: Request, response: Response) {
        try {
            Logger.info('Start process - login');
            // 1. Validate input parameters
            const Params = request.body;
            const Validation: IValidateResponse = ValidateSchema(Params, LoginSchema);
            if (!Validation.success) {
                Logger.error(`Invalid parameters: ${JSON.stringify(Validation)}`, Validation);
                return hdlResponse.setResponse(response, 400, 'Invalid email or password', Validation.errors);
            }
            // 2. Authenticate member
            const FindMember = await this.getMemberByEmail(Params.email);
            if (FindMember) {
                const verifyPassw: boolean = bcrypt.compareSync(Params.passw, FindMember.passw);
                if (verifyPassw) { 
                    const TokenServ = new TokenService();
                    const GenerateToken: string = TokenServ.sign(FindMember);
                    const UpdateToken = await Member.updateOne({ email: Params.email }, { token: GenerateToken });
                    if (!UpdateToken || UpdateToken.modifiedCount < 1) {
                        Logger.error('End process - login - Error member token not updated', UpdateToken);
                        return hdlResponse.setResponse(response, 500, 'Error member token not updated!', UpdateToken);
                    }
                    const DataResponse = { member: JSON.parse(JSON.stringify(FindMember)), token: GenerateToken };
                    delete DataResponse.member.passw;
                    delete DataResponse.member.token;
                    Logger.info(`End process - login - authenticate member: ${JSON.stringify(DataResponse)}`);
                    return hdlResponse.setResponse(response, 200, 'Member has been authenticated successfully!', DataResponse);
                } 
            }
            Logger.info(`End process - login - incorrect member credentials`);
            return hdlResponse.setResponse(response, 401, 'Incorrect credentials, please try again!');
        } catch (error) {
            Logger.error('Error - login ', error);
            return hdlResponse.setResponse(response, 500, 'Error user login, please try again!', error);
        }
    };

    public async storeMember(request: Request, response: Response) {
        try {
            Logger.info('Start process - storeMember');
            // 1. Validate input parameters
            const Params = request.body;
            const Validation: IValidateResponse = ValidateSchema(Params, MemberSchema);
            if (!Validation.success) {
                Logger.error(`Invalid parameters: ${JSON.stringify(Validation)}`, Validation);
                return hdlResponse.setResponse(response, 400, 'Invalid parameters, plase try again!', Validation.errors);
            }
            // 2. Save member
            const SaveMemberResponse: IResponse = await this.saveMember(Params);
            Logger.info(`End process - storeMember: ${JSON.stringify(SaveMemberResponse)}`);
            if (SaveMemberResponse.success) 
                return hdlResponse.setResponse(response, 200, 'Member has been stored successfully!', SaveMemberResponse.data);
            else return hdlResponse.setResponse(response, 409, 'Error member not stored!', SaveMemberResponse.errors);
        } catch (error) {
            Logger.error('Error - storeMember ', error);
            return hdlResponse.setResponse(response, 500, 'Error member not stored, please try again!', error);
        }
    };

    public async updateMember(request: Request|any, response: Response) {
        try {
            Logger.info('Start process - storeMember');
            // 1. Validate input parameters
            const Id: string = request.params.id;
            const Params = request.body;
            const Validation: IValidateResponse = ValidateSchema(Params, MemberSchema);
            if (!Id || Id.length < 1) {
                Logger.info(`Error getMemberById - Invalid id ${Id}`);
                return hdlResponse.setResponse(response, 400, 'Missing member id!', Id);
            }
            if (!Validation.success) {
                Logger.error(`Invalid parameters: ${JSON.stringify(Validation)}`, Validation);
                return hdlResponse.setResponse(response, 400, 'Invalid parameters, plase try again!', Validation.errors);
            }
            // 2. Verify email duplication
            const Duplicated: number = await Member.count({ email: Params.email, _id: { $ne: Id } });
            if (Duplicated) {
                Logger.error(`Email duplicated: ${Duplicated}`, Duplicated);
                return hdlResponse.setResponse(response, 400, 'Invalid email duplicated, plase try again!');
            }
            // 3. Update member
            const MemberRequest: IPayload = request.user;
            const QueryOptions = { _id: Id, email: MemberRequest.email };
            const UpdateMemberResponse: IMember|null = await Member
            .findOneAndUpdate(MemberRequest.role === 'admin' ? { _id: Id } : QueryOptions, {
                firstName: Params.firstName,
                lastName: Params.lastName,
                email: Params.email,
                passw: this.passEncrypt(Params.passw),
                classCompletionDate: Params.classCompletionDate,
                skills: Params.skills,
                role: MemberRequest.role === 'admin' ? Params.role : MemberRequest.role,
            }).select('-passw -token');
            Logger.info(`End process - updateMember: ${JSON.stringify(UpdateMemberResponse)}`);
            if (UpdateMemberResponse) 
                return hdlResponse.setResponse(response, 200, 'Member has been updated successfully!', UpdateMemberResponse);
            else return hdlResponse.setResponse(response, 404, 'Error member not updated!', UpdateMemberResponse);
        } catch (error) {
            Logger.error('Error - updateMember ', error);
            return hdlResponse.setResponse(response, 500, 'Error member not updated, please try again!', error);
        }
    };

    public async getMembers(request: Request|any, response: Response) {
        try {
            Logger.info('Start process - getMembers');
            const MemberRequest: IPayload = request.user;
            const QueryOptions = { email: MemberRequest.email };
            const MembersResponse: IMember[] = await Member
            .find(MemberRequest.role === 'admin' ? {} : QueryOptions)
            .select('-passw -token')
            .sort('createdAt');
            Logger.info(`End process - getMembers: ${JSON.stringify(MembersResponse)}`);
            return hdlResponse.setResponse(response, 200, 'Success Members List', MembersResponse);
        } catch (error) {
            Logger.error('Error - getMembers ', error);
            return hdlResponse.setResponse(response, 500, 'Error getting members, please try again!', error);
        }
    };

    public async getMemberById(request: Request|any, response: Response) {
        try {
            Logger.info('Start process - getMemberById');
            const Id: string = request.params.id;
            if (!Id || Id.length < 1) {
                Logger.info(`Error getMemberById - Invalid id ${Id}`);
                return hdlResponse.setResponse(response, 400, 'Missing member id!', Id);
            }
            const MemberRequest: IPayload = request.user;
            const QueryOptions = { _id: Id, email: MemberRequest.email };
            const MemberResponse: IMember|null = await Member
            .findOne(MemberRequest.role === 'admin' ? { _id: Id } : QueryOptions)
            .select('-passw -token');
            Logger.info(`End process - getMemberById: ${MemberResponse ? JSON.stringify(MemberResponse) : MemberResponse}`);
            if (MemberResponse) return hdlResponse.setResponse(response, 200, 'Success member found!', MemberResponse);
            else return hdlResponse.setResponse(response, 404, 'Member not found');            
        } catch (error) {
            Logger.error('Error - getMemberById ', error);
            return hdlResponse.setResponse(response, 500, 'Error getting member, please try again!', error);
        }
    };

    public async deleteMember(request: Request|any, response: Response) {
        try {
            Logger.info('Start process - deleteMember');
            const MemberRequest: IPayload = request.user;
            const Id: string = request.params.id;
            if (!Id || Id.length < 1 || MemberRequest.sub === Id) {
                const Message: string =  MemberRequest.sub === Id ? 'Cannot delete yourself!' : 'Missing member id!';
                Logger.info(`Error deleteMember - ${Message} ${Id}`);
                return hdlResponse.setResponse(response, 400, Message, Id);
            }
            const DeleteResponse: IMember|null = await Member.findByIdAndDelete(Id).select('-passw -token');
            Logger.info(`End process - deleteMember: ${DeleteResponse}`);
            if (DeleteResponse) return hdlResponse.setResponse(response, 200, 'Success member deleted!', DeleteResponse);
            else return hdlResponse.setResponse(response, 404, 'Member not found');
        } catch (error) {
            Logger.error('Error - getMember ', error);
            return hdlResponse.setResponse(response, 500, 'Error member not deleted, please try again!', error);
        }
    };

    public async getMemberByEmail(email: string): Promise<IMember|null> {
        Logger.info('Start step - getMemberByEmail');
        const MemberResponse: IMember|null = await Member.findOne({ email });
        Logger.info(`End step - getMemberByEmail: ${MemberResponse ? true : false}`);
        return MemberResponse;
    };

    private async saveMember(params: IMember): Promise<IResponse> {
        Logger.info('Start step - saveMember');
        const Response: IResponse = { success: false, errors: [] };
        const Duplicated: number = await Member.count({ email: params.email });
        if (Duplicated) {
            Response.success = false;
            Response.errors.push('Member email already exist');
        } else {
            const createMember: IMember = await Member.create({
                firstName: params.firstName,
                lastName: params.lastName,
                email: params.email,
                passw: this.passEncrypt(params.passw),
                classCompletionDate: params.classCompletionDate,
                skills: params.skills,
                role: params.role,
            });
            if (createMember) {
                const NewMember = JSON.parse(JSON.stringify(createMember));
                delete NewMember.passw;
                delete NewMember.token;
                Response.success = true;
                Response.data = NewMember;
            }
            else {
                Response.success = false;
                Response.errors = ['User not stored'];
                Response.data = createMember;
            }
        }
        Logger.info(`End step - saveMember: ${JSON.stringify(Response)}`);
        return Response; 
    };

    private passEncrypt(passw: string): string {
        Logger.info('Start step - passEncrypt');
        const SaltRounds: number = 10;
        const output: string = bcrypt.hashSync(passw, SaltRounds);
        Logger.info(`End step - passEncrypt`);
        return output;
    };
};

interface IResponse {
    success: boolean,
    data?: any,
    errors: any[],
};