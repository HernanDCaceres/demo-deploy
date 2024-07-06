import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MaxSizeValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = 200 * 1024; // 200KB
    if (value.size > maxSize) {
      throw new BadRequestException(
        'El archivo excede el tamaño máximo permitido de 200KB',
      );
    }
    return value;
  }
}
