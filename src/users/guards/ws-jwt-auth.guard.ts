import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractTokenFromSocket(client);
      
      if (!token) {
        throw new WsException('Authentication token not found');
      }

      const payload = await this.jwtService.verifyAsync(token);
      
      // Attach user info to socket for later use
      client.data.user = payload;
      
      return true;
    } catch (err) {
      throw new WsException('Invalid token');
    }
  }

  private extractTokenFromSocket(client: Socket): string | undefined {
    // Try to get token from handshake auth first
    if (client.handshake.auth.token) {
      return client.handshake.auth.token;
    }
    
    // Fallback to query parameter
    if (client.handshake.query.token) {
      return client.handshake.query.token as string;
    }
    
    // Try to get from headers
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return undefined;
  }
}
