import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'secret', 
      signOptions: { expiresIn: '600s' }, 
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [PassportModule, JwtModule, MongooseModule, UserService],
})
export class UserModule {}
