import { Model } from 'mongoose';
import { Item, ItemDocument } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
export declare class ItemService {
    private readonly itemModel;
    constructor(itemModel: Model<ItemDocument>);
    create(createItemDto: CreateItemDto): Promise<Item>;
    findAll(): Promise<Item[]>;
    findOne(id: string): Promise<Item>;
    findByName(name: string): Promise<Item>;
    deleteByName(name: string): Promise<{
        message: string;
    }>;
    updateAmountByName(name: string, amount: number): Promise<{
        message: string;
    }>;
}
