import jwt, { Algorithm, JwtPayload, SignOptions } from "jsonwebtoken";
import moment from "moment";
import { IMember } from "../modules/v1/models/member.model";

export class TokenService {
    private readonly Secret: string = String(process.env.TOKEN_SECRET);
    private readonly Algorithm: Algorithm = <Algorithm>process.env.TOKEN_ALGORITHM || 'HS256';
    private readonly Expired: string = process.env.TOKEN_EXPIRED || '2h';

    private readonly Config: SignOptions = {
        algorithm: this.Algorithm,
        expiresIn: this.Expired,
    }

    public sign(member: IMember): string {
        const Payload: IPayload = {
            sub: member.id,
            name: member.firstName,
            lastName: member.lastName,
            email: member.email,
            role: member.role,
            iat: moment().utc().unix(),
            exd: moment().add(2, 'hours').utc().unix()
        }
        return jwt.sign(Payload, this.Secret, this.Config);
    };

    public verify(token: string): string | JwtPayload {
        return jwt.verify(token, this.Secret, this.Config);
    }
};

export interface IPayload extends JwtPayload {
    sub: string,
    name: string,
    lastName: string,
    email: string,
    role: string,
    iat: number,
    exd: number
};