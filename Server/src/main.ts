import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { UserManager } from './User/UserManager';


export var mainUserManager;

initConst();
bootServ();

async function initConst() {

mainUserManager = new UserManager();    
}

async function bootServ() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  const io = app.getHttpAdapter().getInstance();
  const port = process.env.PORT ?? 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);


}
