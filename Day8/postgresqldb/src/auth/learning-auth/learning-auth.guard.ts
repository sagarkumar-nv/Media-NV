import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class LearningAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<Request> ();
    const authHeader = request.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')){
      throw new UnauthorizedException('No Token Provided!')
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = this.configService.get('JWT_SECRET');
    if(!jwtSecret) {
      throw new UnauthorizedException('JWT secret not found.')
    }
    // try{
    //   const decode = jwt.verify(jwtSecret);
    //   request['user'] = decode;
    //   return true;
    // }catch(error){
    //   throw new UnauthorizedException('Invalid Token')
    // }
    return true;
  }
}
