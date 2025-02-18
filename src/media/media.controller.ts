import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, BadRequestException, UploadedFiles } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Protect } from 'src/auth/auth.guard';
import { Media } from './entities/media.entity';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}





  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file',{
      storage: diskStorage({
        destination: './uploads',
         filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${extname(file.originalname)}`)
        }
      })
    }),
  )
  async uploadFile(@UploadedFile() file): Promise<Media> {


    if(!file){
      throw new BadRequestException('no file uploaded')
    }
    const createMediaDto: CreateMediaDto = {
      filename: file.filename,
      type: file.mimetype,
      file_url: file.path,
      size: file.size,
    };

    
    //return {file}
    return this.mediaService.uploadMedia(createMediaDto);
  }





  // Multiple files upload endpoint
  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {  // 10 is the maximum number of files you allow
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        }
      })
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files): Promise<Media[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    //const medias = []

      // Use map and Promise.all to handle all the asynchronous operations
  const medias = await Promise.all(
    files.map(async (file) => {
      const createMediaDto: CreateMediaDto = {
        filename: file.filename,
        type: file.mimetype,
        file_url: file.path,
        size: file.size,
      };
      const media = await this.mediaService.uploadMedia(createMediaDto);
      return media;  // Return media to accumulate in the array
    })
  );

    // Wait for all uploads to finish
    return medias;
  }

  

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
