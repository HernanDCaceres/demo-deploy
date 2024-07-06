import { Injectable } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';

@Injectable()
export class FileUploadService {
  constructor(private readonly fileUploadrepository: FileUploadRepository) {}

  async uploadImage(file: Express.Multer.File, productId: string) {
    const response = await this.fileUploadrepository.uploadImage(file);
    return response;
  }
}
