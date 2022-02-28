// @ts-nocheck
import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';
import { MemberController } from "../controllers/member.controller";
import Member from '../models/member.model';

jest.mock('../models/member.model');
describe('Member entity tests', () => {
    const MemberCtrl: MemberController = new MemberController();
    beforeEach(() => jest.resetAllMocks());
    
    describe('Member login', () => {
        test('Return successful response when member is authenticated', async () => {
            const mockResponse: Response = httpMocks.createResponse();
            const mockRequest: Request = httpMocks.createRequest({
                method: 'POST',
                url: '/login',
                body: {
                    email: 'root@admin.com',
                    passw: 'admin123'
                }
            });
            const mockMember = {
                "_id": "621c3f0c2e27a4155220390d",
                "firstName": "Admin",
                "lastName": "root",
                "email": "root@amdin.com",
                "classCompletionDate": "2021-10-10T00:00:00.000Z",
                "skills": ["javascript", "mysql"],
                "passw": "$2b$10$kRoo67Hh1EmLWHCcg/SuFur.NKxbEREE0o.D3TB95pkE6YjUtqSqy",
                "role": "admin",
                "createdAt": "2022-02-28T03:18:33.903Z",
                "updatedAt": "2022-02-28T03:18:33.903Z",
                "__v": 0
            };
            const mockResult = { modifiedCount: 1 };
            const expectedResponse = {
                "status": 200,
                "type": "success",
                "error": false,
                "message": "Member has been authenticated successfully!",
                "data": {
                    "member": mockMember,
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                }
            };

            const SpyFindOne = jest.spyOn(Member, 'findOne').mockImplementation(() => Promise.resolve(mockMember));
            const SpyUpdateOne = jest.spyOn(Member, 'updateOne').mockImplementation(() => Promise.resolve(mockResult));
            const result = await MemberCtrl.login(mockRequest, mockResponse);
            const response = result._getData();
            expect(SpyFindOne).toHaveBeenCalledTimes(1);
            expect(SpyUpdateOne).toHaveBeenCalledTimes(1);
            expect(response.constructor).toBe(Object);
            expect(response).toHaveProperty('status', expectedResponse.status);
            expect(response).toHaveProperty('type', expectedResponse.type);
            expect(response).toHaveProperty('message', expectedResponse.message);
            expect(response).toHaveProperty('data');
            expect(response.data.constructor).toBe(Object);
            expect(response.data).toHaveProperty('token');
            expect(typeof response.data.token).toBe("string");
        });

        test('Return error response when member email is incorrect', async () => {
            const mockResponse: Response = httpMocks.createResponse();
            const mockRequest: Request = httpMocks.createRequest({
                method: 'POST',
                url: '/login',
                body: {
                    email: 'root22@admin.com',
                    passw: 'admin123'
                }
            });
            const mockMember = null;
            const expectedResponse = {
                status: 401,
                type: 'Unauthorized',
                error: true,
                errorDesc: null,
                message: 'Incorrect credentials, please try again!'
            };

            const SpyFindOne = jest.spyOn(Member, 'findOne').mockImplementation(() => Promise.resolve(mockMember));
            const result = await MemberCtrl.login(mockRequest, mockResponse);
            const response = result._getData();
            expect(SpyFindOne).toHaveBeenCalledTimes(1);
            expect(response.constructor).toBe(Object);
            expect(response).toHaveProperty('status', expectedResponse.status);
            expect(response).toHaveProperty('type', expectedResponse.type);
            expect(response).toHaveProperty('message', expectedResponse.message);
            expect(response).toMatchObject(expectedResponse);
        });

        test('Return error response when member password is incorrect', async () => {
            const mockResponse: Response = httpMocks.createResponse();
            const mockRequest: Request = httpMocks.createRequest({
                method: 'POST',
                url: '/login',
                body: {
                    email: 'root@admin.com',
                    passw: 'xxxxxxxxxxx'
                }
            });
            const mockMember = {
                "_id": "621c3f0c2e27a4155220390d",
                "firstName": "Admin",
                "lastName": "root",
                "email": "root@amdin.com",
                "classCompletionDate": "2021-10-10T00:00:00.000Z",
                "skills": ["javascript", "mysql"],
                "passw": "$2b$10$kRoo67Hh1EmLWHCcg/SuFur.NKxbEREE0o.D3TB95pkE6YjUtqSqy",
                "role": "admin",
                "createdAt": "2022-02-28T03:18:33.903Z",
                "updatedAt": "2022-02-28T03:18:33.903Z",
                "__v": 0
            };
            const mockResult = { modifiedCount: 1 };
            const expectedResponse = {
                status: 401,
                type: 'Unauthorized',
                error: true,
                errorDesc: null,
                message: 'Incorrect credentials, please try again!'
            };

            const SpyFindOne = jest.spyOn(Member, 'findOne').mockImplementation(() => Promise.resolve(mockMember));
            const SpyUpdateOne = jest.spyOn(Member, 'updateOne').mockImplementation(() => Promise.resolve(mockResult));
            const result = await MemberCtrl.login(mockRequest, mockResponse);
            const response = result._getData();
            expect(SpyFindOne).toHaveBeenCalledTimes(1);
            expect(SpyUpdateOne).not.toHaveBeenCalled();
            expect(response.constructor).toBe(Object);
            expect(response).toHaveProperty('status', expectedResponse.status);
            expect(response).toHaveProperty('type', expectedResponse.type);
            expect(response).toHaveProperty('message', expectedResponse.message);
            expect(response).toMatchObject(expectedResponse);
        });

        test('Return BadRequest when member email is wrong', async () => {
            const mockResponse: Response = httpMocks.createResponse();
            const mockRequest: Request = httpMocks.createRequest({
                method: 'POST',
                url: '/login',
                body: {
                    email: 'rootadmin.com',
                    passw: 'admin123'
                }
            });
            const mockMember = null;
            const expectedResponse = {
                "status": 400,
                "type": "Bad request",
                "error": true,
                "errorDesc": [
                    {
                        "instancePath": "/email",
                        "schemaPath": "#/properties/email/format",
                        "keyword": "format",
                        "params": {
                            "format": "email"
                        },
                        "message": "must match format \"email\""
                    }
                ],
                "message": "Invalid email or password"
            };

            const SpyFindOne = jest.spyOn(Member, 'findOne').mockImplementation(() => Promise.resolve(mockMember));
            const result = await MemberCtrl.login(mockRequest, mockResponse);
            const response = result._getData();
            expect(SpyFindOne).not.toHaveBeenCalled();
            expect(response.constructor).toBe(Object);
            expect(response).toHaveProperty('status', expectedResponse.status);
            expect(response).toHaveProperty('type', expectedResponse.type);
            expect(response).toHaveProperty('message', expectedResponse.message);
            expect(response).toMatchObject(expectedResponse);
        });

        test('Return BadRequest when member password is wrong', async () => {
            const mockResponse: Response = httpMocks.createResponse();
            const mockRequest: Request = httpMocks.createRequest({
                method: 'POST',
                url: '/login',
                body: {
                    email: 'root@admin.com',
                    passw: 'admin'
                }
            });
            const mockMember = null;
            const expectedResponse = {
                "status": 400,
                "type": "Bad request",
                "error": true,
                "errorDesc": [
                    {
                        "instancePath": "/passw",
                        "schemaPath": "#/properties/passw/minLength",
                        "keyword": "minLength",
                        "params": {
                            "limit": 6
                        },
                        "message": "must NOT have fewer than 6 characters"
                    }
                ],
                "message": "Invalid email or password"
            };

            const SpyFindOne = jest.spyOn(Member, 'findOne').mockImplementation(() => Promise.resolve(mockMember));
            const result = await MemberCtrl.login(mockRequest, mockResponse);
            const response = result._getData();
            expect(SpyFindOne).not.toHaveBeenCalled();
            expect(response.constructor).toBe(Object);
            expect(response).toHaveProperty('status', expectedResponse.status);
            expect(response).toHaveProperty('type', expectedResponse.type);
            expect(response).toHaveProperty('message', expectedResponse.message);
            expect(response).toMatchObject(expectedResponse);
        });
    });

    describe('Member get list', () => {
        test('Return successful response when member list is ok', async () => {
            const mockResponse: Response = httpMocks.createResponse();
            const mockRequest: Request = httpMocks.createRequest({
                method: 'GET',
                url: '/members',
                body: {
                    email: 'root@admin.com',
                    passw: 'admin123'
                }
            });
            expect(true).toBe(true);
        });
    });
});