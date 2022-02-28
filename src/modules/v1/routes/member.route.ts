import express, { Request, Response, Router } from 'express';
import EnsureAuth from '../../../middlewares/authentication.middleware';
import { MemberController } from '../controllers/member.controller';
import AllowPath from '../middlewares/member.middleware';

class MemberRoute {
    public Route: Router = express.Router();
    private MemberCtrl: MemberController = new MemberController();

    constructor() {
        this.setMemberRoutes();
    };

    private setMemberRoutes = (): void => {
        // Member login
        this.Route.post('/login', (req: Request, res: Response) => this.MemberCtrl.login(req, res));
        // Member storage
        this.Route.post('/members', [EnsureAuth, AllowPath], (req: Request, res: Response) => this.MemberCtrl.storeMember(req, res));
        // Member update
        this.Route.put('/members/:id', [EnsureAuth, AllowPath], (req: Request, res: Response) => this.MemberCtrl.updateMember(req, res));
        // Members list
        this.Route.get('/members', [EnsureAuth, AllowPath], (req: Request, res: Response) => this.MemberCtrl.getMembers(req, res));
        // Member details
        this.Route.get('/members/:id', [EnsureAuth, AllowPath], (req: Request, res: Response) => this.MemberCtrl.getMemberById(req, res));
        // Member delete
        this.Route.delete('/members/:id', [EnsureAuth, AllowPath], (req: Request, res: Response) => this.MemberCtrl.deleteMember(req, res));
    };
};

export default new MemberRoute().Route;