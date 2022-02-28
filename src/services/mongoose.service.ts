import { connect, ConnectOptions } from 'mongoose'; 

const _Host: string = process.env.DB_HOST || '';
const _Port: number = Number(process.env.DB_PORT) || 27017;
const _User: string = process.env.DB_USER || '';
const _Pass: string = process.env.DB_PASS || '';
const _Database: string = process.env.DB_SCHEMA || '';
const _ConnectTimeout: number = Number(process.env.DB_CONNECT_TIMEOUT || 5000);

const HOST = `${_Host}:${_Port}`;
const Options: ConnectOptions = {
    user: _User,
    pass: _Pass,
    dbName: _Database,
    authSource: 'admin',
    connectTimeoutMS: _ConnectTimeout,
    maxPoolSize: 5,
    minPoolSize: 1,
    maxIdleTimeMS: 10000
};

export const conexion = () => connect(HOST, Options);
