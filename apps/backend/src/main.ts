import './instrumentation';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Needed so request.ip reflects the real client behind Render/proxies
  // (used by CallerAuthGuard IP allowlisting).
  app.set('trust proxy', 1);

  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
  // Capacitor's WebView serves the app from its own scheme regardless of
  // environment, so these origins must always be allowed alongside the web frontend.
  app.enableCors({
    origin: [
      frontendOrigin,
      'capacitor://localhost',
      'http://localhost',
      'https://localhost',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`Listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
