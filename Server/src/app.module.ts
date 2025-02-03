import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import {GatewayServer} from './GatewayServer';

@Module({
  imports: [ServeStaticModule.forRoot({
    rootPath: path.resolve(__dirname, '..', '..', 'Client', 'dist','client','browser'),
    exclude: ['/api*', '/socket.io/*'],
    }),],
  controllers: [AppController],
  providers: [AppService, GatewayServer],
})
export class AppModule {}