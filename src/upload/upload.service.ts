import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream, promises as fs } from 'fs';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadsDir = join(process.cwd(), 'uploads');
  private readonly chunksDir = join(this.uploadsDir, 'chunks');
  private readonly filesDir = join(this.uploadsDir, 'files');
  private readonly photoDir = join(this.filesDir, 'photo');
  private readonly musicDir = join(this.filesDir, 'music');

  constructor(private readonly prisma: PrismaService) {
    fs.mkdir(this.chunksDir, { recursive: true });
    fs.mkdir(this.musicDir, { recursive: true });
    fs.mkdir(this.photoDir, { recursive: true });
  }

  async upload(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!Buffer.isBuffer(file.buffer)) {
      throw new BadRequestException('Invalid file buffer');
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const isPhoto = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    const saveDir: string = isPhoto ? this.photoDir : this.musicDir;

    const fileName = uuidv4() + `.${ext}`;
    const filePath = join(saveDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    return {
      fileName: fileName,
    };
  }

  registerChunk(file: Express.Multer.File, fileId: string, chunkIndex: string) {
    if (!file) throw new BadRequestException('Chunk is required');
    if (!fileId || chunkIndex === undefined)
      throw new BadRequestException('fileId or chunkIndex missing');

    return { received: true, fileId, chunkIndex, tempName: file.filename };
  }

  async mergeChunks(fileId: string, totalChunks: number, filename?: string) {
    if (!fileId) throw new BadRequestException('fileId is required');

    const ext = filename?.split('.').pop() || 'mp3';
    const finalName = filename || `${uuidv4()}.${ext}`;
    const finalPath = join(this.musicDir, finalName);

    const writeStream = createWriteStream(finalPath);

    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = join(this.chunksDir, `${fileId}_chunk_${i}`);
      try {
        const data = await fs.readFile(chunkPath);
        writeStream.write(data);
        await fs.unlink(chunkPath);
      } catch (err) {
        writeStream.end();
        throw new BadRequestException(`Chunk ${i} missing`);
      }
    }

    writeStream.end();

    return {
      merged: true,
      fileName: finalName,
      path: `/uploads/files/${finalName}`,
    };
  }
}
