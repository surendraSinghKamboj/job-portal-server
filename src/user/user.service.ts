import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Redister User Function
  async register(registerUserDto: RegisterUserDto) {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      profileBio,
      profileSkills,
      profileResume,
      profileResumeOriginalName,
      profilePhoto,
      role,
    } = registerUserDto; // Destructuring

    if (!fullName || !email || !phoneNumber || !password) {
      throw new BadRequestException('All Feilds are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        profileBio,
        profileSkills,
        profileResume,
        profileResumeOriginalName,
        profilePhoto,
        role,
      },
    });

    if (!user) {
      throw new BadRequestException('User not Created.');
    }
    return { user, success: true, message: 'User Created Successfully.' };
  }

  // Login User Function
  async login(email: string, password: string, role: string) {
    if (!email || !password || !role) {
      throw new BadRequestException('All Feilds are required');
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Password');
    }

    if (role !== user.role) {
      throw new UnauthorizedException('Invalid Role');
    }

    const token = this.jwtService.sign(
      { userId: user.id },
      { secret: process.env.SECRET_KEY, expiresIn: '1d' },
    );
    return {
      token,
      user,
      success: true,
      message: 'User Logged In Successfully.',
    };
  }

  // Logout User Function
  async logout(): Promise<{ message: string; success: boolean }> {
    return { message: 'Logout Successfully', success: true };
  }

  // Update User Function
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const {
      fullName,
      email,
      phoneNumber,
      profileBio,
      profileSkills,
      profileResume,
      profilePhoto,
    } = updateUserDto;

    if (!fullName || !email || !phoneNumber || !profileBio || !profileSkills) {
      throw new BadRequestException('All Feilds are required');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        fullName,
        email,
        phoneNumber,
        profileBio,
        profileSkills,
        profileResume,
        profilePhoto,
      },
    });

    return { user, success: true, message: 'User Updated Successfully' };
  }
}
