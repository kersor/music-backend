import { ApiProperty } from '@nestjs/swagger';

export class DtoCreateMusic {
  @ApiProperty({ example: 'Numb', description: 'Название трека' })
  name: string;

  @ApiProperty({ example: 'numb.mp3', description: 'Имя аудиофайла' })
  filename: string;

  @ApiProperty({ example: 'cover.jpg', description: 'Имя файла обложки' })
  image: string;

  @ApiProperty({ example: 185, description: 'Длительность трека в секундах' })
  duration: number;
}
