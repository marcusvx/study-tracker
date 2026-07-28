import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Module({
  providers: [AuthUserService, SupabaseAuthGuard],
  exports: [AuthUserService, SupabaseAuthGuard],
})
export class AuthModule {}
