import { NextFunction, Response } from "express";
import { IPayload } from "../../../services/jwt.service";
import { hdlResponse } from "../../../services/response-handler.service";
import { Logger } from "../../../services/winston.service";
import { IRequestAuth } from "../interfaces/request.interface";

const AllowPath = (request: IRequestAuth, response: Response, next: NextFunction) => {
    let allow: boolean  = false;
    try {
        Logger.info('MID MEMBER - Start permissions validation');
        const Member: IPayload = request.user;
        const RouteAccessResource: string[] = request.url.split('/');
        const RouteAccess: string = `${request.method}${RouteAccessResource[1]}`.toUpperCase();
        
        if (!Member) {
            Logger.error('MID MEMBER - Request user property not found');
            return hdlResponse.setResponse(response, 403, "Access denied, you don't have permissions!");
        }
        const Sources: any = {
            POSTMEMBERS: IsAllow('create', Member.role),
            PUTMEMBERS: IsAllow('update', Member.role),
            GETMEMBERS: IsAllow('view', Member.role),
            DELETEMEMBERS: IsAllow('create', Member.role),
        };
        allow = RouteAccess in Sources && Sources[RouteAccess];
    } catch (error) {
        Logger.error('MID MEMBER - Error operation forbidden ', error);
        return hdlResponse.setResponse(response, 500, 'Error member forbidden, please try again!', error);
    };
    Logger.info('MID MEMBER - End permissions validation allow success');
    if (allow) return next();
    return hdlResponse.setResponse(response, 403, "Access denied, you don't have permissions!");
};

const IsAllow = (permission: string, role: string) => {
    const Rights: any = {
        create: (role === 'admin'),
        update: (role === 'admin' || role === 'standard'),
        view: (role === 'admin' || role === 'standard'),
        delete: (role === 'admin'),
    };
    return Rights[permission];
};

export default AllowPath;