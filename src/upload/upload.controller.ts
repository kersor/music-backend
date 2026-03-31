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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Загрузка файлов')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Загрузить файл целиком' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: { type: 'string', format: 'binary', description: 'Файл для загрузки' },
      },
    },
  })
  @ApiOkResponse({ description: 'Файл успешно загружен' })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }

  @ApiOperation({ summary: 'Загрузить чанк файла' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['chunk', 'fileId', 'chunkIndex'],
      properties: {
        chunk: { type: 'string', format: 'binary', description: 'Часть файла' },
        fileId: { type: 'string', description: 'Идентификатор файла' },
        chunkIndex: { type: 'string', description: 'Порядковый номер чанка' },
      },
    },
  })
  @ApiOkResponse({ description: 'Чанк принят сервером' })
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

  @ApiOperation({ summary: 'Склеить чанки в один файл' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fileId', 'totalChunks'],
      properties: {
        fileId: { type: 'string', description: 'Идентификатор файла' },
        totalChunks: { type: 'number', description: 'Общее количество чанков' },
        filename: { type: 'string', description: 'Имя итогового файла' },
      },
    },
  })
  @ApiOkResponse({ description: 'Чанки успешно объединены' })
  @Post('merge')
  async mergeChunks(
    @Body() body: { fileId: string; totalChunks: number; filename?: string },
  ) {
    const { fileId, totalChunks, filename } = body;
    return this.uploadService.mergeChunks(fileId, totalChunks, filename);
  }
}
