import { Request, Response, NextFunction } from 'express';
import { hdlResponse } from '../services/response-handler.service';
import { Logger } from '../services/winston.service';

export const ApiKeyAccess = (request: Request, response: Response, next: NextFunction) => {
    const AuthorizedKey: string|undefined = process.env.APIKEY;
    const HeaderKey: string|string[]|undefined = request.headers['x-api-key'] || request.headers['X-API-KEY'];

    Logger.info(`Start Request - ${request.method} ${request.url}`);
    Logger.info('MID APIKEY - Start to match apikey');
    if (!HeaderKey || !AuthorizedKey){
        Logger.error('MID APIKEY - 401 Missing API Key');
        return hdlResponse.setResponse(response, 401, 'Missing API Key');
    }
    
    if (AuthorizedKey !== HeaderKey) {
        Logger.error('MID APIKEY - 401 Invalid API Key');
        return hdlResponse.setResponse(response, 401, 'Invalid API Key');
    }
    
    //Here you can add another security methods like desencrypt request data
    Logger.info('MID APIKEY - Successful client API key authentication');
    next();
} 