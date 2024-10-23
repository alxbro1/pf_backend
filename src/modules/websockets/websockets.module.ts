import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websockets.gateway';

@Module({
  providers: [WebsocketGateway],
})
export class WebsocketModule {}
