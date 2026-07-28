import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Needed so request.ip reflects the real client behind Render/proxies
  // (used by CallerAuthGuard IP allowlisting).
  app.set('trust proxy', 1);

  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
  app.enableCors({ origin: frontendOrigin });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
