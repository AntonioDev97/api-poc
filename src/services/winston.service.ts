import { createLogger, format, transports } from "winston";
import { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";
import moment from 'moment';

const _DEV = process.env.DEVELOPMENT === 'true' ? true : false;
const TransportsInstances: (ConsoleTransportInstance|FileTransportInstance)[] = [
    new transports.File({
        filename: `./logs/API${moment().format('DDMMYYYY')}.log`, 
        maxsize: 200000000,
        handleExceptions: true,
    })
]
// if is local or development enviroments display messages in console
if (_DEV) TransportsInstances.push(new transports.Console());

export const Logger = createLogger({
    level: _DEV ? 'debug' : 'info',
    format: format.combine(
        format.simple(),
        format.errors({ stack: true }),
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.prettyPrint(),
        format.printf(info => `[${info.timestamp}]${info.level} - ${info.message}`),
    ),
    transports: TransportsInstances,
    exitOnError: false,
});