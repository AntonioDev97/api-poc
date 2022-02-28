import express, { Express } from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import { ApiKeyAccess } from './middlewares/apikey.middleware';
import MemberRoutes from './modules/v1/routes/member.route';

export class AppServer {
    public server: Express = express();

    constructor() {
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));
        this.server.use(helmet());
        this.setHeaders();
        this.server.use(ApiKeyAccess)
        this.setEndpoints();
    };

    private setHeaders(): void {
        const Config: CorsOptions = {
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: [
                'Access-Control-Allow-Origin',
                'Authorization',
                'X-API-KEY',
                'Origin',
                'X-Requested-With',
                'Content-Type, Accept',
                'Access-Control-Allow-Request-Method'
            ],
        };
        this.server.use(cors(Config));
    };

    private setEndpoints(): void {
        this.server.use('/v1', [
            MemberRoutes,
        ]);
    };
};