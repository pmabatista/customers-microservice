"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const app_module_1 = require("./app.module");
const fastify_1 = require("fastify");
const aws_lambda_1 = require("@fastify/aws-lambda");
const common_1 = require("@nestjs/common");
async function bootstrapServer() {
    const serverOptions = { logger: true };
    const instance = (0, fastify_1.fastify)(serverOptions);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(instance), { logger: !process.env.AWS_EXECUTION_ENV ? new common_1.Logger() : console });
    await app.init();
    return instance;
}
const handler = async (event, context) => {
    const instance = await bootstrapServer();
    const proxy = (0, aws_lambda_1.default)(instance);
    return proxy(event, context);
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map