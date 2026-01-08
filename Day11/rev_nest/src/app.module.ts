import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:(configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('DB_HOST'),
          username: configService.get('DB_USER'),
          port: configService.get('DB_PORT'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [join(process.cwd(), 'dist/**/*.entity.js')],
          synchronize: true
      }),
    })
    
    ,PersonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
