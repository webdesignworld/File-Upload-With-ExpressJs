import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coder, CoderSchema } from './../schema/coder.schema';
import { CoderService } from '../service/coder.service';
import { CoderController } from '../controller/coder.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coder.name, schema: CoderSchema }]),
  ],
  controllers: [CoderController],
  providers: [CoderService],
})
export class CoderModule {}
