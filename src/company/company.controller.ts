import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto/company.dto';

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
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getCompanyById(@Req() req: any, @Param('id') companyId: string) {
    const userId = req.user.id;
    const company = await this.companyService.getCompanyById(userId, companyId);

    return { company, success: true, message: 'Company Found' };
  }

  //   Delete Company By Id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteCompanyById(@Req() req: any, @Param('id') companyId: string) {
    const userId = req.user.id;
    const company = await this.companyService.deleteCompanyById(
      userId,
      companyId,
    );

    return { company, success: true, message: 'Company Deleted.' };
  }

  //   Update Company By Id
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCompanyById(
    @Req() req: any,
    @Param('id') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const userId = req.user.id;
    const company = await this.companyService.updateCompanyById(
      userId,
      companyId,
      updateCompanyDto,
    );

    return { company, success: true, message: 'Company Updated.' };
  }
}
