

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coder, CoderDocument } from '../schema/coder.schema';
import { CreateCoderDto } from '../../dto/create-coder.dto';
import { UpdateCoderDto } from '../../dto/update-coder.dto';
import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { uploadFileToSupabase, MulterFile } from '../../upload/upload.util';

@Injectable()
export class CoderService {
  constructor(
    @InjectModel(Coder.name) private coderModel: Model<CoderDocument>,
  ) {}

  async create(createCoderDto: CreateCoderDto): Promise<Coder> {
    const createdCoder = new this.coderModel(createCoderDto);
    return createdCoder.save();
  }

  async findAll(): Promise<Coder[]> {
    return this.coderModel.find().exec();
  }

  async findOne(id: string): Promise<Coder> {
    const coder = await this.coderModel.findById(id).exec();
    if (!coder) {
      throw new NotFoundException(`Coder with id ${id} not found`);
    }
    return coder;
  }

  async update(id: string, updateCoderDto: UpdateCoderDto): Promise<Coder> {
    const updatedCoder = await this.coderModel
      .findByIdAndUpdate(id, updateCoderDto, { new: true })
      .exec();
    if (!updatedCoder) {
      throw new NotFoundException(`Coder with id ${id} not found`);
    }
    return updatedCoder;
  }

  async remove(id: string): Promise<Coder> {
    const deletedCoder = await this.coderModel.findByIdAndDelete(id).exec();
    if (!deletedCoder) {
      throw new NotFoundException(`Coder with id ${id} not found`);
    }
    return deletedCoder;
  }

  async updateProfile(
    coderId: string,
    updateProfileDto: UpdateProfileDto,
    file?: MulterFile,
  ): Promise<Coder> {
    let avatarUrl: string | undefined;


    if (file) {
      avatarUrl = await uploadFileToSupabase(file);
    }


    const updateData: any = {};
    if (avatarUrl) {
      updateData.avatar = avatarUrl;
    }
    if (updateProfileDto.first_name) {
      updateData.first_name = updateProfileDto.first_name;
    }
    if (updateProfileDto.last_name) {
      updateData.last_name = updateProfileDto.last_name;
    }
    if (updateProfileDto.about) {
      updateData.about = updateProfileDto.about;
    }


    const updatedCoder = await this.coderModel
      .findByIdAndUpdate(coderId, updateData, { new: true })
      .exec();

    if (!updatedCoder) {
      throw new NotFoundException(`Coder with id ${coderId} not found`);
    }

    return updatedCoder;
  }
}
