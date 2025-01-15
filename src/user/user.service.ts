import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

    console.log(registerUserDto);

    if (!fullName || !email || !phoneNumber || !password) {
      throw new BadRequestException('All Feilds are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('Existing User :', existingUser);
  }
}
