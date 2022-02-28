import { Request } from "express";
import { IPayload } from "../../../services/jwt.service";

export interface IRequestAuth extends Request{
    user: IPayload
}