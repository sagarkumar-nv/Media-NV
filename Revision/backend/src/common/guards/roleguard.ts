import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE } from "../enum/role.enum";
import { ROLES_KEY } from "../decorators/roledecorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const RequiredRoles = this.reflector.getAllAndOverride<ROLE[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!RequiredRoles) return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return RequiredRoles.includes(user.role as ROLE);
    }
}