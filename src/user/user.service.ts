import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username });
  }

  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = new this.userModel({ username, password: hashedPassword });
    return user.save();
  }

  async login(username: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.findUserByUsername(username);

    if (!user) {
      throw new HttpException(`user name or password are not correct`, HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(`user name or password are not correct`, HttpStatus.UNAUTHORIZED);
    }
    const payload = { username: user.username, sub: user._id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find();
  }

  private extractUserIdFromToken(token: string): string | undefined {
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
  
      const decoded = jwt.verify(token, jwtSecret); 
      return typeof decoded['sub'] === 'string' ? decoded['sub'] : undefined;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new NotFoundException('Invalid token: ' + error.message);
    }
  }

  async getUserFromToken(jwtToken: string): Promise<UserDocument> {
    const userId = this.extractUserIdFromToken(jwtToken);
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async updateUserCart(cartId: Types.ObjectId, userId: string) {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    user.cart = cartId;
    user.save();
  }
  
}
