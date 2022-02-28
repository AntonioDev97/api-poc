import { NextFunction, Response } from "express";
import moment from "moment";
import { MemberController } from "../modules/v1/controllers/member.controller";
import { IRequestAuth } from "../modules/v1/interfaces/request.interface";
import { IMember } from "../modules/v1/models/member.model";
import { TokenService } from "../services/jwt.service";
import { hdlResponse } from "../services/response-handler.service";
import { Logger } from "../services/winston.service";

const EnsureAuth: any = async (request: IRequestAuth, response: Response, next: NextFunction) => {
    try {
        Logger.info('MID TOKEN - Start token authentication');
        const TokenServ: TokenService = new TokenService();
        let headerToken: string = <string>request.headers['Authorization'] || request.headers['authorization'] || '';
        if (!headerToken || headerToken.length < 80) {
            Logger.info(`MID TOKEN - Missing token: ${headerToken}`);
            return hdlResponse.setResponse(response, 401, 'Missing Authorization Token!', headerToken);
        }
        headerToken = headerToken.replace(/['"]+/g,'');
        const Payload: any = TokenServ.verify(headerToken);
        if (Payload.exd && Payload.exd <= moment.utc().unix()) {
            Logger.info('MID TOKEN - Token expired' + Payload.exd);
            return hdlResponse.setResponse(response, 401, 'Authorization token expired!', headerToken);
        }
        const MemberCtrl: MemberController = new MemberController();
        const FindMember: IMember|null = await MemberCtrl.getMemberByEmail(Payload.email); 
        if (!FindMember || headerToken !== FindMember.token) {
            Logger.info(`MID TOKEN - Invalid old token: ${Payload.exd}`);
            return hdlResponse.setResponse(response, 401, 'Invalid old authorization token!', headerToken);
        }
        request.user = Payload;
        Logger.info('MID TOKEN - End token authentication');
    } catch (error) {
        Logger.error('MID TOKEN - Error member token invalid ', error)
        return hdlResponse.setResponse(response, 401, 'Invalid authorization token!');
    }
    return next();
};

export default EnsureAuth;