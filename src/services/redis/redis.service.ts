import { Injectable, Inject } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { CACHE_EXPIRATION } from 'src/constants/cache-keys';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(@Inject('REDIS_OPTIONS') private readonly options: RedisOptions) {
    this.client = new Redis(options);

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttl: number = CACHE_EXPIRATION.EXP_TIME,
  ): Promise<void> {
    try {
      const stringifiedValue = JSON.stringify(value);
      await this.client.set(key, stringifiedValue, 'EX', ttl);
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error('Error deleting key from Redis:', error);
      return 0;
    }
  }

  async clear(): Promise<string> {
    try {
      return await this.client.flushdb();
    } catch (error) {
      console.error('Error clearing Redis database:', error);
      return '';
    }
  }
}
