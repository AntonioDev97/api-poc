import dotenv, { DotenvConfigOutput } from 'dotenv'; dotenv.config();
import { conexion } from './src/services/mongoose.service';
import { AppServer } from './src/app';
import { Logger } from './src/services/winston.service';

/**
 * @author Antonio Olvera
 * @description init application server
 */
class InitApplication {
    constructor() {
        this.initServer();
    }

    public static initEnviroment(): DotenvConfigOutput {
        return dotenv.config();
    }

    private initServer(): void {
        const _PORT: number = Number(process.env.PORT) || 4001;
        const APP: AppServer = new AppServer();
        APP.server.listen(_PORT, () => Logger.info(`Starting API Server - Server Running on Port ${_PORT}`)); 
    }
}

(async () => {
    try {
        // Init enviroment
        Logger.info('Starting API Server - Initialize enviroment variables');
        InitApplication.initEnviroment();
        // Init Database
        Logger.info('Starting API Server - Initialize database conexion');
        await conexion();
        // Init server application
        Logger.info('Starting API Server - Initialize application server');
        new InitApplication();
    } catch (error) {
        Logger.error('Error at initialize server: ', error);
    }
})();
