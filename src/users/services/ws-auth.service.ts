import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class WsAuthService {
  private readonly logger = new Logger(WsAuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      this.logger.error('Token validation failed:', error);
      return null;
    }
  }

  extractTokenFromSocket(client: any): string | null {
    // Try to get token from handshake auth first
    if (client.handshake?.auth?.token) {
      return client.handshake.auth.token;
    }
    
    // Fallback to query parameter
    if (client.handshake?.query?.token) {
      return client.handshake.query.token as string;
    }
    
    // Try to get from headers
    const authHeader = client.handshake?.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return null;
  }
}
