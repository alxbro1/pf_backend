import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          if (error.children && error.children.length) {
            return {
              property: error.property,
              children: error.children.map((child) => {
                if (child.children && child.children.length) {
                  return {
                    property: child.property,
                    children: child.children.map((grandchild) => ({
                      property: grandchild.property,
                      constraints: grandchild.constraints,
                    })),
                  };
                }
                return {
                  property: child.property,
                  constraints: child.constraints,
                };
              }),
            };
          }
          return { property: error.property, constraints: error.constraints };
        });

        return new BadRequestException({
          alert: 'Se han detectado los siguientes errores en la petición:',
          errors: cleanErrors,
        });
      },
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('GameVault - PF Co 53 - FT/FS')
    .setDescription(
      'Esta es una API construida con Nest para ser empleada en PF Cohorte 53 - Grupo 5 - FT/FS',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
