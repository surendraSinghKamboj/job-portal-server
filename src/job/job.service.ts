import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostJobDTO } from './dto/job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async createJob(userId: string, postJobdto: PostJobDTO) {
    

    const job = await this.prisma.job.create({
      data: {
        ...postJobdto,
        userId,
      },
    });

    if (!job) {
      throw new BadRequestException('Job not created');
    }

    return job;
  }
}
