import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    
    if (!requiredRoles) {
      return true; // No role restriction
    }

    // Get request and extract role from header
    const request = context.switchToHttp().getRequest();
    const userRole = request.headers['x-user-role']?.toLowerCase();

    // Check if user role is in required roles
    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(`Access denied. Required role: ${requiredRoles.join(' or ')}`);
    }

    return true;
  }
}
