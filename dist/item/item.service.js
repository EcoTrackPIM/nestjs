"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const item_entity_1 = require("./entities/item.entity");
const itemDefaultsRaw = require("./data/defaults.json");
let ItemService = class ItemService {
    constructor(itemModel) {
        this.itemModel = itemModel;
    }
    async create(createItemDto) {
        const itemDefaults = itemDefaultsRaw.default || itemDefaultsRaw;
        const { name } = createItemDto;
        console.log('🧪 Raw JSON test:', itemDefaults);
        console.log('📥 Incoming create request:', name);
        console.log('🗂 Type of itemDefaults:', typeof itemDefaults);
        console.log('🗂 Default items loaded (preview):', Array.isArray(itemDefaults) ? itemDefaults.slice(0, 2) : itemDefaults);
        if (!Array.isArray(itemDefaults)) {
            throw new Error('❌ itemDefaults is not an array. Check defaults.json or tsconfig setup.');
        }
        const defaultItem = itemDefaults.find((item) => item.name.toLowerCase() === name.toLowerCase());
        if (!defaultItem) {
            console.error(`❌ No default item found for name: ${name}`);
            throw new common_1.NotFoundException(`No default item found for name: ${name}`);
        }
        const newItemData = {
            ...defaultItem,
            name: createItemDto.name,
        };
        console.log('✅ Final new item data:', newItemData);
        const createdItem = new this.itemModel(newItemData);
        return createdItem.save();
    }
    async findAll() {
        return this.itemModel.find().exec();
    }
    async findOne(id) {
        const item = await this.itemModel.findById(id).exec();
        if (!item) {
            throw new common_1.NotFoundException(`Item with ID ${id} not found`);
        }
        return item;
    }
    async findByName(name) {
        const item = await this.itemModel.findOne({ name }).exec();
        if (!item) {
            throw new common_1.NotFoundException(`Item with name "${name}" not found`);
        }
        return item;
    }
    async deleteByName(name) {
        const deletedItem = await this.itemModel.findOneAndDelete({ name }).exec();
        if (!deletedItem) {
            throw new common_1.NotFoundException(`Item "${name}" not found or already deleted`);
        }
        return { message: `Item "${name}" deleted successfully` };
    }
    async updateAmountByName(name, amount) {
        const updatedItem = await this.itemModel.findOneAndUpdate({ name }, { $set: { amount } }, { new: true }).exec();
        if (!updatedItem) {
            throw new common_1.NotFoundException(`Item "${name}" not found`);
        }
        return { message: `✅ Amount updated for item "${name}" to ${amount}` };
    }
};
ItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(item_entity_1.Item.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ItemService);
exports.ItemService = ItemService;
//# sourceMappingURL=item.service.js.map