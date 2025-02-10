
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateManagerDto } from '../../dto/create-manager.dto';
import { Manager, ManagerDocument } from '../schema/manager.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel(Manager.name)
    private readonly managerModel: Model<ManagerDocument>,
    private readonly jwtService: JwtService,
  ) {}


  async register(createManagerDto: CreateManagerDto) {
    const { email, password, first_name, last_name } = createManagerDto;

    try {
      console.log('🔍 Checking if manager exists:', email);
      const existingManager = await this.managerModel.findOne({ email }).exec();
      if (existingManager) {
        throw new ConflictException('User with this email already exists');
      }

      console.log('🔐 Hashing password...');
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      console.log('📝 Creating new manager...');
      const newManager = new this.managerModel({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: 'manager',
      });

      console.log('📌 Saving to database...');
      await newManager.save();

      console.log('✅ Manager created successfully:', newManager);
      return { message: 'Manager created successfully', manager: newManager };
    } catch (error) {
      console.error('❌ Error creating manager:', error);
      throw new Error('Failed to create manager');
    }
  }

 
  async login(email: string, password: string): Promise<{ access_token: string; user: any }> {
    console.log(`🔍 Looking for manager: ${email}`);

    const manager = await this.managerModel.findOne({ email }).exec();
    if (!manager) {
      console.error('❌ Manager not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`🔐 Checking password for: ${email}`);
    const passwordMatch = await bcrypt.compare(password, manager.password);
    if (!passwordMatch) {
      console.error('❌ Password does not match');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`✅ Generating JWT token for: ${email}`);
    const access_token = this.generateToken(manager);

    return {
      access_token,
      user: {
        id: manager._id,
        email: manager.email,
        role: manager.role,
      },
    };
  }


 
  private generateToken(manager: ManagerDocument): string {
    return this.jwtService.sign({
      id: manager._id,
      email: manager.email,
      role: manager.role,
    });
  }
}
