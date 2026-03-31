import { ApiPropertyOptional } from '@nestjs/swagger';

export class DtoUpdateCollection {
  @ApiPropertyOptional({ example: 'Любимые треки', description: 'Название коллекции' })
  name?: string;

  @ApiPropertyOptional({
    example: 'playlist-cover.jpg',
    description: 'Имя файла обложки коллекции',
  })
  image?: string;
}
