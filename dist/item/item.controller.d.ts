import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    create(createItemDto: CreateItemDto, req: any): Promise<import("./entities/item.entity").Item>;
    findAll(): Promise<import("./entities/item.entity").Item[]>;
    findOne(id: string): Promise<import("./entities/item.entity").Item>;
    findByName(name: string): Promise<import("./entities/item.entity").Item>;
    deleteByName(name: string): Promise<{
        message: string;
    }>;
    updateAmountByName(name: string, amount: number): Promise<{
        message: string;
    }>;
}
