import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VisionService } from './vision.service';

@Controller('vision')
export class VisionController {
  constructor(private readonly visionService: VisionService) {}

  @Post('detect-text')
  @UseInterceptors(FileInterceptor('file'))  // 'file' is the key in form-data
  async detectText(@UploadedFile() file: Express.Multer.File) {
    // Pass the local file buffer to the VisionService
    return await this.visionService.detectText(file.buffer);
  }
}
