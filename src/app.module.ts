import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { join } from 'path';
import { MusicModule } from './music/music.module';
import { CollectionModule } from './collection/collection.module';

const serveStaticOptions: ServeStaticModuleOptions = {
  rootPath: join(process.cwd(), 'uploads'),
  serveRoot: '/uploads',
};

@Module({
  imports: [
    ServeStaticModule.forRoot(serveStaticOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    UploadModule,
    MusicModule,
    CollectionModule,
  ],
})
export class AppModule {}
