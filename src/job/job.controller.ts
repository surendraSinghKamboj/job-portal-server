import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { PostJobDTO } from './dto/job.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(@Req() req: any, @Body() postJobdto: PostJobDTO) {
    const userId = req.user.id;
    const job = await this.jobService.createJob(userId, postJobdto);

    return job;
  }
}
