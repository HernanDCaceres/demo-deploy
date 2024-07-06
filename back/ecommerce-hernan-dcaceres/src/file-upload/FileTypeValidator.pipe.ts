import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileTypeValidatorPipe implements PipeTransform {
  private allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.mimetype) {
      throw new BadRequestException('Archivo no contiene un tipo MIME.');
    }

    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten JPEG, PNG, JPG y WEBP.',
      );
    }
    return value;
  }
}
