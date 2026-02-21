import { CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get('roles', context.getHandler())
        const req = context.switchToHttp().getRequest()

        if(!roles.includes(req["user"].role)){
            throw new ForbiddenException()
        }

        return true
    }
}