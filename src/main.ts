import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ExcludeNullInterceptor } from './utils/excludeNull.interceptor';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ExcludeNullInterceptor());
  app.use(cookieParser());

  // AWS CONFIGURATIONS
  // const configService = app.get(ConfigService);
  // configService.update({
  //   accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
  //   secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
  //   region: configService.get('AWS_REGION'),
  // });

  await app.listen(3000);
}
bootstrap();
