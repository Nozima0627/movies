import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes( new ValidationPipe({
    whitelist: true
  }))
  const config = new DocumentBuilder()
  .setTitle('Movies')
  .addBearerAuth()
  .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, documentFactory, {swaggerOptions:{
    persistAuthorization: true
  }})
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
