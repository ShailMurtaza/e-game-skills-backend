import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // strips unexpected fields
            forbidNonWhitelisted: true, // throws if unknown fields exist
            transform: true, // converts plain JSON into class instances
            transformOptions: { enableImplicitConversion: true },
            stopAtFirstError: true,
        }),
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
