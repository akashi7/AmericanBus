import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { createAdminDto, userLoginDto } from './dto';
import { ERoles } from './enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateToken(
    userId: number,
    email: string,
    fullName: string,
    role: string,
    id: number,
  ): {
    data: {
      id: number;
      userId: number;
      email: string;
      fullName: string;
      role: string;
    };
    token: string;
  } {
    const token = this.Jwt.sign(
      { id, userId, email, fullName, role },
      {
        secret: this.config.get('JWT_SECRET'),
      },
    );
    return {
      data: {
        id,
        userId,
        email,
        fullName,
        role,
      },
      token,
    };
  }

  async createAdmin(dto: createAdminDto): Promise<Admin> {
    const admin = await this.prisma.admin.create({
      data: {
        email: dto.email,
        fullNames: dto.fullNames,
      },
    });
    const password = await argon.hash(dto.password);
    await this.prisma.user.create({
      data: {
        email: admin.email,
        fullNames: admin.fullNames,
        role: ERoles.ADMIN,
        userId: admin.id,
        password,
      },
    });
    return admin;
  }

  async userLogin(dto: userLoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    else {
      if (!(await argon.verify(user.password, dto.password))) {
        throw new ForbiddenException('Wrong password');
      }
      return this.generateToken(
        user.userId,
        user.email,
        user.fullNames,
        user.role,
        user.id,
      );
    }
  }
}
