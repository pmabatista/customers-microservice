import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { fastify, FastifyInstance, FastifyServerOptions } from 'fastify';
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import awsLambdaFastify from '@fastify/aws-lambda';
import { Logger } from '@nestjs/common';

async function bootstrapServer(): Promise<FastifyInstance> {
  const serverOptions: FastifyServerOptions = { logger: true };
  const instance: FastifyInstance = fastify(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
    { logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console }
  );
  await app.init();
  return instance;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const instance = await bootstrapServer();
  const proxy = awsLambdaFastify(instance);
  return proxy(event, context);
};
