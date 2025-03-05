import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import path from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { UserManager } from './User/UserManager';


const clientDistDir:any = path.resolve(__dirname, '..', '..', 'Client', 'dist','client','browser');

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
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);


}
