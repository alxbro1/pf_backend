import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PORT } from './config/enviroments.config';
const morgan = require('morgan');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GameVault - PF Co 53 - FT/FS')
    .setDescription(
      'Esta es una API construida con Nest para ser empleada en PF Cohorte 53 - Grupo 5 - FT/FS',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(Number(PORT ?? 3001));
}
bootstrap();
