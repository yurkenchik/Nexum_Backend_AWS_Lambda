import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import serverlessExpress from "@vendia/serverless-express";

import { Callback, Context, Handler } from "aws-lambda";
import { AppModule } from "src/app.module";

let server: Handler;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const expressApp = await app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
}
