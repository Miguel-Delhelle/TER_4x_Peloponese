"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainUserManager = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = __importDefault(require("path"));
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const UserManager_1 = require("./User/UserManager");
const clientDistDir = path_1.default.resolve(__dirname, '..', '..', 'Client', 'dist', 'client', 'browser');
initConst();
bootServ();
async function initConst() {
    exports.mainUserManager = new UserManager_1.UserManager();
}
async function bootServ() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    const io = app.getHttpAdapter().getInstance();
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
//# sourceMappingURL=main.js.map