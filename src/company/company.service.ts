import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async registerCompany(
    userId: string,
    registerCompanyDto: RegisterCompanyDto,
  ) {
    const { name, description, website, location, logo } = registerCompanyDto;

    const existingCompany = await this.prisma.company.findUnique({
      where: { name },
    });
    if (existingCompany) {
      throw new BadRequestException('Company already exists');
    }

    const newCompany = await this.prisma.company.create({
      data: {
        name,
        description,
        website,
        location,
        logo,
        userId,
      },
    });

    return newCompany;
  }

  async getAllCompany(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    const companies = await this.prisma.company.findMany({ where: { userId } });

    if (!companies) {
      throw new NotFoundException('Company not found');
    }

    return companies;
  }

  //  Get Company By Id
  async getCompanyById(userId: string, companyId: string) {
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }

    const company = await this.prisma.company.findFirst({
      where: { id: companyId, userId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  //  Delete Company By Id
  async deleteCompanyById(userId: string, companyId: string) {
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }

    const company = await this.prisma.company.findFirst({
      where: { id: companyId, userId },
    });

    console.log(company);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const deletedCompany = await this.prisma.company.delete({
      where: { id: companyId },
    });

    return deletedCompany;
  }

  // Update Company By Id
  async updateCompanyById(
    userId: string,
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    const company = await this.prisma.company.update({
      where: { id: companyId },
      data: updateCompanyDto,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
