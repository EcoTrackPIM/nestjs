"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const intercepteurs_1 = require("./intercepteurs");
const path_1 = require("path");
const fs_1 = require("fs");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/',
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type,Authorization',
    });
    app.useGlobalInterceptors(new intercepteurs_1.LoggingInterceptor());
    const uploadDir = (0, path_1.join)(process.cwd(), 'uploads');
    if (!(0, fs_1.existsSync)(uploadDir)) {
        (0, fs_1.mkdirSync)(uploadDir);
    }
    app.use('/uploads', express.static(uploadDir));
    const port = 3000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap().catch(err => {
    console.error('Failed to start server:', err);
});
//# sourceMappingURL=main.js.map