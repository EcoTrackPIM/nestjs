import { Controller, Post, Get, Patch, Delete, Body, Param, Req } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(@Body() createItemDto: CreateItemDto, @Req() req: any) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  async findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    return this.itemService.findByName(name);
  }

  @Delete('name/:name')
  async deleteByName(@Param('name') name: string) {
    return this.itemService.deleteByName(name);
  }

  @Patch('name/:name/amount')
  async updateAmountByName(
    @Param('name') name: string,
    @Body('amount') amount: number,
  ) {
    return this.itemService.updateAmountByName(name, amount);
  }
}