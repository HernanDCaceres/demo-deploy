import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { FileUploadRepository } from './file-upload.repository';
import { CloudinaryService } from './cloudinary.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [FileUploadController],
  providers: [
    FileUploadService,
    CloudinaryConfig,
    FileUploadRepository,
    CloudinaryService,
  ],
})
export class FileUploadModule {}
