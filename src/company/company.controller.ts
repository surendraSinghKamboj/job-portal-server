import {
  Body,
  Controller,
  Get,
  //   Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterCompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  // Register Company
  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerCompany(
    @Req() req,
    @Body() registerCompanyDto: RegisterCompanyDto,
  ) {
    const userId = req.user.id;
    const company = await this.companyService.registerCompany(
      userId,
      registerCompanyDto,
    );

    return { message: 'Company Created Successfully', company, success: true };
  }

  //   Get All Companies
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllCompany(@Req() req: any) {
    const userId = req.user.id;
    const companies = await this.companyService.getAllCompany(userId);

    return { companies, success: true, message: 'All Companies Found' };
  }

  //   Get Company By Id
  //   @UseGuards(JwtAuthGuard)
  //   @Get(':id')
  //   async getCompanyById(@Req() req: any, @Param('id') id: string) {
  //     const userId = req.user.id;
  //     const company = await this.companyService.getCompanyById(userId, id);
  //   }
}
