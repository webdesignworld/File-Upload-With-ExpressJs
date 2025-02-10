import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { CoderService } from '../service/coder.service';
import { CreateCoderDto } from '../../dto/create-coder.dto';
import { UpdateCoderDto } from '../../dto/update-coder.dto';
import { UpdateProfileDto } from '../../dto/update-profile.dto';

@Controller('coders')
export class CoderController {
  constructor(private readonly coderService: CoderService) {}


  
  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar', { storage: multer.memoryStorage() }))
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: any, 
    
    @Req() req: Request,
  ) {
 //for testing
    const coderId = '67a9d931f0bbe5bfa38724db'
    // if (!coderId) {
    //   throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    // }
    return this.coderService.updateProfile(coderId, updateProfileDto, file);
  }


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
