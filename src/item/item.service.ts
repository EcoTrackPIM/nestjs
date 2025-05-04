import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './entities/item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import * as itemDefaultsRaw from './data/defaults.json';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const itemDefaults = (itemDefaultsRaw as any).default || itemDefaultsRaw;
    const { name } = createItemDto;
    console.log('🧪 Raw JSON test:', itemDefaults);
    console.log('📥 Incoming create request:', name);
    console.log('🗂 Type of itemDefaults:', typeof itemDefaults);
    console.log('🗂 Default items loaded (preview):', Array.isArray(itemDefaults) ? itemDefaults.slice(0, 2) : itemDefaults);

    if (!Array.isArray(itemDefaults)) {
      throw new Error('❌ itemDefaults is not an array. Check defaults.json or tsconfig setup.');
    }

    const defaultItem = itemDefaults.find(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );

    if (!defaultItem) {
      console.error(`❌ No default item found for name: ${name}`);
      throw new NotFoundException(`No default item found for name: ${name}`);
    }

    const newItemData = {
      ...defaultItem,
      name: createItemDto.name,
    };

    console.log('✅ Final new item data:', newItemData);

    const createdItem = new this.itemModel(newItemData);
    return createdItem.save();
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async findByName(name: string): Promise<Item> {
    const item = await this.itemModel.findOne({ name }).exec();
    if (!item) {
      throw new NotFoundException(`Item with name "${name}" not found`);
    }
    return item;
  }

  async deleteByName(name: string): Promise<{ message: string }> {
    const deletedItem = await this.itemModel.findOneAndDelete({ name }).exec();
    if (!deletedItem) {
      throw new NotFoundException(`Item "${name}" not found or already deleted`);
    }
    return { message: `Item "${name}" deleted successfully` };
  }

  async updateAmountByName(name: string, amount: number): Promise<{ message: string }> {
    const updatedItem = await this.itemModel.findOneAndUpdate(
      { name },
      { $set: { amount } },
      { new: true }
    ).exec();

    if (!updatedItem) {
      throw new NotFoundException(`Item "${name}" not found`);
    }

    return { message: `✅ Amount updated for item "${name}" to ${amount}` };
  }
}