import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisOptions } from 'ioredis';
@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    RedisService,
    {
      provide: 'REDIS_OPTIONS',
      useFactory: (configService: ConfigService): RedisOptions => ({
        host: configService.get<string>('REDIS_HOST') || 'localhost',
        port: configService.get<number>('REDIS_PORT') || 6379,
      }),
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule { }