import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { join } from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }

  @Post('chunk')
  @UseInterceptors(
    FileInterceptor('chunk', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'chunks'),
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { fileId: string; chunkIndex: string },
  ) {
    const { fileId, chunkIndex } = body;
    return { received: true, fileName: file.filename, fileId, chunkIndex };
  }

  @Post('merge')
  async mergeChunks(
    @Body() body: { fileId: string; totalChunks: number; filename?: string },
  ) {
    const { fileId, totalChunks, filename } = body;
    return this.uploadService.mergeChunks(fileId, totalChunks, filename);
  }
}
