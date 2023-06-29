import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WebSocketAdapter } from './websocket/adapters/websocket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors();
  app.useWebSocketAdapter(new WebSocketAdapter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
