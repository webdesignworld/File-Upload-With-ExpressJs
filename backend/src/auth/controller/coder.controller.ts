import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoderService } from '../service/coder.service';
import { CreateCoderDto } from '../../dto/create-coder.dto';
import { UpdateCoderDto } from '../../dto/update-coder.dto';

@Controller('coders')
export class CoderController {
  constructor(private readonly coderService: CoderService) {}


  @Post()
  async create(@Body() createCoderDto: CreateCoderDto) {
    return this.coderService.create(createCoderDto);
  }


  @Get()
  async findAll() {
    return this.coderService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coderService.findOne(id);
  }

 
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCoderDto: UpdateCoderDto) {
    return this.coderService.update(id, updateCoderDto);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.coderService.remove(id);
  }
}
