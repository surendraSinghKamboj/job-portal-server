import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, UpdateUserDto } from './dto/user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() body, @Res() res: Response) {
    const { email, password, role } = body;
    try {
      const { token, user, success, message } = await this.userService.login(
        email,
        password,
        role,
      );
      res.cookie('token', token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      });
      return res.status(200).json({ success, message, user });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    try {
      const result = await this.userService.logout();
      res.cookie('token', '', {
        maxAge: 0,
        httpOnly: true,
        sameSite: 'strict',
      });
      return res.status(200).json({ result });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Update User
  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updateProfile(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const userId = req.user.id;
      const user = await this.userService.updateUser(userId, updateUserDto);

      return res.status(200).json({ user });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
