import { ILoginRequest } from './interfaces/login.request';

/**
 * This class is an abstract controller. You must extend it and decorate each method to
 * - protect the method by auth guarg
 * - inject required parameters, see method def for more details
 */
export abstract class AuthController<LoginRequest extends ILoginRequest> {
    /**
     * The action to display the login view
     *
     * Login logic is delegated to Auth Guard
     *
     * @param req The http request (@Req|@Request)
     * @param namespace the query namespace (@Query('namespace'))
     * @param redirect  the query redirect (@Query('redirect'))
     */
    loginAction(req: any, namespace: string = 'user.ops', redirect?: string) {
        const user: any = req.user;
        if (user && user.namespace !== namespace) {
            req.logout();
        }
        return { data: { namespace, user: req.user, redirect } };
    }

    /**
     * The action to login
     * @param data The data (@Body)
     * @param request The http request (@Req|@Request)
     */
    loginCheckAction(data: LoginRequest, request: any) {
        const response = { success: true };
        if (!request.user) {
            response.success = false;
        }
        if (request.get('accept') === 'application/json') {
            return response;
        } else {
            return request.res.redirect('/auth/login');
        }
    }

    /**
     * The action to logout
     * @param req The http request (@Req|@Request)
     */
    logoutAction(req: any) {
        if (req.isAuthenticated()) {
            req.logOut();
        }
        if (req.get('accept') === 'application/json') {
            return { ok: true };
        } else {
            req.res.redirect('/auth/login');
        }
    }
}
