import { ApiProperty } from '@nestjs/swagger';

export class IUpload {
  @ApiProperty({ description: 'ID загруженного файла' })
  id: string;

  @ApiProperty({ description: 'Имя загруженного файла' })
  name: string;
}
