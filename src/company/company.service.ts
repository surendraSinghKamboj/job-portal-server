import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterCompanyDto } from './dto/company.dto';

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

  getAllCompany(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    const companies = this.prisma.company.findMany({ where: { userId } });

    if (!companies) {
      throw new NotFoundException('Company not found');
    }

    return companies;
  }

  getCompanyById() {}
}
