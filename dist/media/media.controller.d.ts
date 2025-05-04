import { MediaService } from './media.service';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    uploadFile(file: any): Promise<Media>;
    uploadMultipleFiles(files: any): Promise<Media[]>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMediaDto: UpdateMediaDto): string;
    remove(id: string): string;
}
