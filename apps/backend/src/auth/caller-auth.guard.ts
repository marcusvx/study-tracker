import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import { Request } from 'express';
import { AppLogger } from '../telemetry/app-logger';

/**
 * Caller-agnostic auth for internal cron/webhook endpoints.
 * Requires a shared Bearer secret and an IP present in CRON_ALLOWED_IPS.
 * Works with cron-job.org, GitHub Actions, Cloudflare, curl, etc. —
 * as long as the caller's egress IP is allowlisted.
 */
@Injectable()
export class CallerAuthGuard implements CanActivate {
  private readonly logger = new AppLogger(CallerAuthGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientIp = normalizeIp(request.ip) ?? 'unknown';
    const route = `${request.method} ${request.originalUrl ?? request.url}`;

    const expectedSecret = this.config.get<string>('CRON_SECRET')?.trim();
    if (!expectedSecret) {
      this.logger.warn('Caller auth rejected (401): secret not configured', {
        'http.route': route,
        'http.client_ip': clientIp,
        'auth.reason': 'secret_not_configured',
      });
      throw new UnauthorizedException('Caller auth is not configured');
    }

    const provided = this.extractBearer(request);
    if (!provided || !timingSafeEqualString(provided, expectedSecret)) {
      this.logger.warn('Caller auth rejected (401): invalid credentials', {
        'http.route': route,
        'http.client_ip': clientIp,
        'auth.reason': provided ? 'invalid_secret' : 'missing_bearer',
      });
      throw new UnauthorizedException('Invalid caller credentials');
    }

    const allowedIps = parseAllowlist(
      this.config.get<string>('CRON_ALLOWED_IPS'),
    );
    if (allowedIps.size === 0) {
      this.logger.warn(
        'Caller auth rejected (403): IP allowlist not configured',
        {
          'http.route': route,
          'http.client_ip': clientIp,
          'auth.reason': 'allowlist_not_configured',
        },
      );
      throw new ForbiddenException('Caller IP allowlist is not configured');
    }

    if (!clientIp || clientIp === 'unknown' || !allowedIps.has(clientIp)) {
      this.logger.warn('Caller auth rejected (403): IP not allowed', {
        'http.route': route,
        'http.client_ip': clientIp,
        'auth.reason': 'ip_not_allowed',
      });
      throw new ForbiddenException('Caller IP is not allowed');
    }

    return true;
  }

  private extractBearer(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) return undefined;
    const token = header.slice('Bearer '.length).trim();
    return token.length > 0 ? token : undefined;
  }
}

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function parseAllowlist(raw: string | undefined): Set<string> {
  if (!raw?.trim()) return new Set();
  return new Set(
    raw
      .split(',')
      .map((ip) => normalizeIp(ip.trim()))
      .filter((ip): ip is string => Boolean(ip)),
  );
}

/** Strip IPv6-mapped IPv4 prefix so allowlists can use plain IPv4. */
function normalizeIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  const trimmed = ip.trim().toLowerCase();
  if (trimmed.startsWith('::ffff:')) {
    return trimmed.slice('::ffff:'.length);
  }
  return trimmed;
}
